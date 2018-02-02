import { DEBUG } from '@glimmer/env';
import { getWithDefault } from '@ember/object';
import config from 'ember-get-config';

import { getValidationsForKey } from '@ember-decorators/argument/-debug';

let valueMap = new WeakMap();

function valuesFor(obj) {
  if (!valueMap.has(obj)) {
    valueMap.set(obj, Object.create(null));
  }

  return valueMap.get(obj);
}

let internalArgumentDecorator = function(target, key, desc, options) {
  if (DEBUG) {
    let validations = getValidationsForKey(target, key);
    validations.isArgument = true;
    validations.typeRequired = getWithDefault(config, '@ember-decorators/argument.typeRequired', false);
  }

  // always ensure the property is writeable, doesn't make sense otherwise (babel bug?)
  desc.writable = true;
  desc.configurable = true;

  if (desc.initializer === null || desc.initializer === undefined) {
    desc.initializer = undefined;
    return;
  }

  let initializer = desc.initializer;

  let get = function() {
    let values = valuesFor(this);

    if (!Object.hasOwnProperty.call(values, key)) {
      values[key] = initializer.call(this);
    }

    return values[key];
  };

  let set;

  if (options.defaultIfNullish === true) {
    set = function(value) {
      if (value !== undefined && value !== null) {
        valuesFor(this)[key] = value;
      }
    }
  } else if (options.defaultIfUndefined === true) {
    set = function(value) {
      if (value !== undefined) {
        valuesFor(this)[key] = value;
      }
    }
  } else {
    set = function(value) {
      valuesFor(this)[key] = value;
    }
  }

  return {
    get,
    set
  };
}

export function argument(maybeOptions, maybeKey, maybeDesc) {
  if (typeof maybeKey === 'string' && typeof maybeDesc === 'object') {
    return internalArgumentDecorator(maybeOptions, maybeKey, maybeDesc, { defaultIfUndefined: false });
  }

  return function(target, key, desc) {
    return internalArgumentDecorator(target, key, desc, maybeOptions);
  }
}
