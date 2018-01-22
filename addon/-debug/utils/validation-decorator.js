import EmberObject from '@ember/object';
import Component from '@ember/component';
import Controller from '@ember/controller';
import Service from '@ember/service';

import {
  makeComputed,
  isMandatorySetter,
  isDescriptor,
  isDescriptorTrap
} from './computed';

import { getPropertyDescriptor } from './object';
import { getValidationsFor, getValidationsForKey } from './validations-for';

import { IS_EMBER_2 } from 'ember-compatibility-helpers';

import {
  MutabilityError,
  RequiredFieldError,
  TypeError
} from '../errors';

function defineWrappedProperty(instance, key, isComputed, isAlias, desc) {
  let wrappedComputed = makeComputed(desc);

  // Aliases don't cache, instead they proxy directly to another property.
  // Non-computeds are "volatile" by nature, so we must always recompute.
  if (!isComputed || isAlias) {
    wrappedComputed.volatile();
  }

  // Mark the computed as an alias in case it gets consumed by future validated properties
  wrappedComputed.altKey = isAlias;

  // Explicitly redefine the property to ensure that we will be able to use Ember.defineProperty later
  Object.defineProperty(instance, key, {
    configurable: true,
    writable: true,
    enumerable: true,
    value: undefined
  });

  Ember.defineProperty(instance, key, wrappedComputed);
}

function runValidators(validators, constructor, key, value, phase) {
  validators.forEach((validator) => {
    if (validator(value) === false) {
      throw new TypeError(`${constructor}#${key} expected value of type ${validator} during '${phase}', but received: ${value}`);
    }
  });
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

  let originalValue = instance[key];

  let isComputed = false;
  let meta = Ember.meta(instance);

  if (meta.peekDescriptors) {
    let computedDescriptor = meta.peekDescriptors(key);
    isComputed = !!computedDescriptor;

    cachedValue = isComputed ? computedDescriptor : cachedValue;
  } else if (isDescriptorTrap(originalValue)) {
    isComputed = true;

    cachedValue = originalValue.__DESCRIPTOR__;
  } else {
    isComputed = isDescriptor(cachedValue);
  }

  let isAlias = isComputed && !!cachedValue.altKey;
  let getter, setter;

  if (isComputed) {
    getter = cachedValue.get.bind(cachedValue, instance, key);
    setter = cachedValue.set.bind(cachedValue, instance, key);
  } else if ((typeof originalGet === 'function' || typeof originalSet === 'function') && !isMandatorySetter(originalSet)) {
    getter = originalGet ? originalGet.bind(instance) : () => { throw new Error('attempted to get a property without a getter') };
    setter = originalSet ? originalSet.bind(instance) : () => { throw new Error('attempted to set a property without a setter') };
  } else {
    // Reset the cached value to get the true initial value of the field
    cachedValue = originalValue;

    getter = () => cachedValue;
    setter = (value) => cachedValue = value;
  }

  // get the true original value again (finalize any computeds)
  originalValue = getter();

  if (typeValidators.length > 0) {
    runValidators(typeValidators, constructor, key, originalValue, 'init');
  } else if (typeRequired) {
    throw new TypeError(`${constructor}#${key} requires a type, add one using the @type decorator`);
  }

  if (isImmutable) {
    defineWrappedProperty(instance, key, isComputed, isAlias, {
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
  } else if (typeValidators.length > 0) {
    defineWrappedProperty(instance, key, isComputed, isAlias, {
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
        if (IS_EMBER_2 && (!isComputed || isAlias)) {
          Ember.propertyDidChange(instance, key);
        }

        return value;
      }
    });
  }
}

const validatingCreateMixin = {
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
};

EmberObject.reopenClass(validatingCreateMixin);
Component.reopenClass(validatingCreateMixin);
Controller.reopenClass(validatingCreateMixin);
Service.reopenClass(validatingCreateMixin);

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
