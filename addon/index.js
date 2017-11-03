import { DEBUG } from '@glimmer/env';
import { getWithDefault } from '@ember/object';
import config from 'ember-get-config';

import {
  getInitializersFor,
  getOrCreateInitializersFor
} from './-private/initializers-meta';

import { validationDecorator } from '@ember-decorators/argument/-debug';

export { immutable, required, type } from '@ember-decorators/argument/-debug';

let internalArgumentDecorator = function(target, key, desc, options, validations) {
  if (DEBUG) {
    validations.isArgument = true;
    validations.typeRequired = getWithDefault(config, 'emberArgumentDecorators.typeRequired', false);
  }

  // always ensure the property is writeable, doesn't make sense otherwise (babel bug?)
  desc.writable = true;
  desc.configurable = true;

  if (desc.initializer === null) return;

  const initializers = getOrCreateInitializersFor(target);
  initializers[key] = desc.initializer;

  desc.initializer = function() {
    const initializers = getInitializersFor(Object.getPrototypeOf(this));
    const initializer = initializers[key];

    let value = this[key];

    if (typeof initializer === 'function') {
      const shouldInitialize = options.defaultIfUndefined ? value === undefined : this.hasOwnProperty(key) === false;

      if (shouldInitialize) {
        value = initializer.call(this);
      }
    }

    return value;
  }
}

if (DEBUG) {
  internalArgumentDecorator = validationDecorator(internalArgumentDecorator);
}

export function argument(maybeOptions, maybeKey, maybeDesc) {
  if (typeof maybeKey === 'string' && typeof maybeDesc === 'object') {
    return internalArgumentDecorator(maybeOptions, maybeKey, maybeDesc, { defaultIfUndefined: false });
  }

  return function(target, key, desc) {
    return internalArgumentDecorator(target, key, desc, maybeOptions);
  }
}
