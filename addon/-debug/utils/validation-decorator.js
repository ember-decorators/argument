import EmberObject from '@ember/object';
import { computed, get } from '@ember/object';

import { validationsFor, validationsForKey } from '@ember-decorators/utils/debug';

import { SUPPORTS_NEW_COMPUTED } from 'ember-compatibility-helpers';

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

function runValidators(validators, constructor, key, value) {
  validators.forEach((validator) => {
    if (validator(value) === false) {
      throw new TypeError(`${constructor}#${key} expected value of type ${validator}, but received: ${value}`);
    }
  });
}

EmberObject.reopenClass({
  create(props) {
    const instance = this._super(props);

    const constructor = this;
    const prototype = Object.getPrototypeOf(instance);
    const validations = validationsFor(prototype);

    for (let key in validations) {
      const {
        isImmutable,
        isRequired,
        typeValidators,
        typeRequired
      } = validations[key];

      if (isRequired && !instance.hasOwnProperty(key)) {
        throw new RequiredFieldError(`${constructor} requires a '${key}' argument to be passed in when using the component`);
      }

      let value = get(instance, key);

      if (typeValidators.length > 0) {
        runValidators(typeValidators, constructor, key, value);
      } else if (typeRequired) {
        throw new TypeError(`${constructor}#${key} requires a type, add one using the @type decorator`);
      }

      if (isImmutable) {
        instance[key] = makeComputed({
          get() {
            return value;
          },

          set(key, value) {
            throw new MutabilityError(`Attempted to set ${constructor}#${key} to the value ${value} but the field is immutable`);
          }
        });
      } else if (typeValidators.length) {
        let cachedValue = value;

        instance[key] = makeComputed({
          get() {
            return cachedValue;
          },

          set(key, value) {
            runValidators(typeValidators, constructor, key, value);

            return cachedValue = value;
          }
        });
      }
    }

    return instance;
  }
});

export default function validationDecorator(fn) {
  return function(target, key, desc) {
    const validations = validationsForKey(target, key);

    // always ensure the property is writeable, doesn't make sense otherwise (babel bug?)
    desc.writable = true;
    desc.configurable = true;

    fn(target, key, desc, validations);

    if (desc.initializer === null) desc.initializer = undefined;
  }
}
