import EmberObject from '@ember/object';
import { computed } from '@ember/object';

import { getValidationsFor, getValidationsForKey } from './validations-for';

import { SUPPORTS_NEW_COMPUTED, IS_EMBER_2 } from 'ember-compatibility-helpers';

import {
  MutabilityError,
  RequiredFieldError,
  TypeError
} from '../errors';

function makeComputed(desc) {
  if (SUPPORTS_NEW_COMPUTED) {
    return computed(desc);
  } else {
    const { get, set } = desc;

    return computed(function (key, value) {
      if (arguments.length > 1) {
        return set.call(this, key, value);
      }

      return get.call(this);
    });
  }
}

function getPropertyDescriptor(object, key) {
  if (object === undefined) return;

  return Object.getOwnPropertyDescriptor(object, key) || getPropertyDescriptor(Object.getPrototypeOf(object), key);
}

function runValidators(validators, constructor, key, value, phase) {
  validators.forEach((validator) => {
    if (validator(value) === false) {
      throw new TypeError(`${constructor}#${key} expected value of type ${validator} during '${phase}', but received: ${value}`);
    }
  });
}

function isMandatorySetter(setter) {
  return setter && setter.toString().match('You must use .*set()') !== null;
}

function wrapField(constructor, instance, validations, key) {
  const {
    isImmutable,
    isRequired,
    typeValidators,
    typeRequired
  } = validations[key];

  if (isRequired && instance[key] === undefined && !instance.hasOwnProperty(key)) {
    throw new RequiredFieldError(`${constructor} requires a '${key}' argument to be passed in when using the component`);
  }

  let {
    get: originalGet,
    set: originalSet,
    value: cachedValue
  } = getPropertyDescriptor(instance, key);

  let isComputed = false;
  let meta = Ember.meta(instance);

  if (meta.peekDescriptors) {
    let computedDescriptor = meta.peekDescriptors(key);
    isComputed = !!computedDescriptor;

    cachedValue = isComputed ? computedDescriptor : cachedValue;
  } else {
    isComputed = cachedValue !== null && typeof cachedValue === 'object' && cachedValue.isDescriptor;
  }

  let getter, setter;

  if (isComputed) {
    getter = cachedValue.get.bind(cachedValue, instance, key);
    setter = cachedValue.set.bind(cachedValue, instance, key);
  } else if ((typeof originalGet === 'function' || typeof originalSet === 'function') && !isMandatorySetter(originalSet)) {
    getter = originalGet ? originalGet.bind(instance) : () => { throw new Error('attempted to get a property without a getter') };
    setter = originalSet ? originalSet.bind(instance) : () => { throw new Error('attempted to set a property without a setter') };
  } else {
    // Reset the cached value to get the true initial value of the field
    cachedValue = instance[key];

    getter = () => cachedValue;
    setter = (value) => cachedValue = value;
  }

  let originalValue = getter();

  if (typeValidators.length > 0) {
    runValidators(typeValidators, constructor, key, originalValue, 'init');
  } else if (typeRequired) {
    throw new TypeError(`${constructor}#${key} requires a type, add one using the @type decorator`);
  }

  if (isImmutable) {
    let wrapperComputed = makeComputed({
      get() {
        let newValue = getter();

        if (newValue !== originalValue) {
          throw new MutabilityError(`Immutable value ${constructor}#${key} changed by underlying computed, original value: ${originalValue}, new value: ${newValue}`);
        }

        return newValue;
      },

      set(key, value) {
        throw new MutabilityError(`Attempted to set ${constructor}#${key} to the value ${value} but the field is immutable`);
      }
    });

    if (!isComputed) {
      wrapperComputed.volatile();
    }

    Ember.defineProperty(instance, key, { value: wrapperComputed });
  } else if (typeValidators.length > 0) {
    let wrapperComputed = makeComputed({
      get() {
        let newValue = getter();

        runValidators(typeValidators, constructor, key, newValue, 'get');

        return newValue;
      },

      set(key, value) {
        runValidators(typeValidators, constructor, key, value, 'set');

        // Legacy Ember does not return the value from ComputedProperty.set calls,
        // so we have to side-effect and return the value directly
        setter(value);

        // Volatile computeds cannot be watched (they never trigger `propertyDidChange`)
        // in Ember 2 so we need to trigger it manually in the case where we're proxying
        // to a simple value/getter/setter
        if (!isComputed && IS_EMBER_2) {
          Ember.propertyDidChange(instance, key);
        }

        return value;
      }
    });

    if (!isComputed) {
      wrapperComputed.volatile();
    }

    Ember.defineProperty(instance, key, { value: wrapperComputed });
  }
}

EmberObject.reopenClass({
  create() {
    const instance = this._super.apply(this, arguments);

    const constructor = this;
    const prototype = Object.getPrototypeOf(instance);
    const validations = getValidationsFor(prototype);

    if (!validations) {
      return instance;
    }

    for (let key in validations) {
      wrapField(constructor, instance, validations, key);
    }

    return instance;
  }
});

export default function validationDecorator(fn) {
  return function(target, key, desc, options) {
    const validations = getValidationsForKey(target, key);

    // always ensure the property is writeable, doesn't make sense otherwise (babel bug?)
    desc.writable = true;
    desc.configurable = true;

    fn(target, key, desc, options, validations);

    if (desc.initializer === null) desc.initializer = undefined;
  }
}
