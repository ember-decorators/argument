import { DEBUG } from '@glimmer/env';
import { getWithDefault } from '@ember/object';
import config from 'ember-get-config';

import { validationDecorator } from '@ember-decorators/argument/-debug';

export { immutable, required, type } from '@ember-decorators/argument/-debug';

const initializersMap = new WeakMap();

function getOrCreateInitializersFor(target) {
  if (!initializersMap.has(target)) {
    const parentInitializers = getInitializersFor(Object.getPrototypeOf(target));
    initializersMap.set(target, Object.create(parentInitializers || null));
  }

  return initializersMap.get(target);
}

function getInitializersFor(target) {
  // Reached the root of the prototype chain
  if (target === null) return target;

  return initializersMap.get(target) || getInitializersFor(Object.getPrototypeOf(target));
}

let argument = function(target, key, desc, validations) {
  if (DEBUG) {
    validations.isArgument = true;

    // type required needs work, it doesn't work if we use addons that decided not to use @type
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
      const initIfUndefined = initializers.__initIfUndefined && initializers.__initIfUndefined[key];

      const shouldInitialize = initIfUndefined ? value === undefined : this.hasOwnProperty(key) === false;

      if (shouldInitialize) {
        value = initializer.call(this);
      }
    }

    return value;
  }
}

if (DEBUG) {
  argument = validationDecorator(argument);
}

function defaultIfUndefined(target, key, desc) {
  const initializers = getOrCreateInitializersFor(target);

  initializers.__initIfUndefined = initializers.__initIfUndefined || {};
  initializers.__initIfUndefined[key] = true;

  return desc;
}

export { argument, defaultIfUndefined };
