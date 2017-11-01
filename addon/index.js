import { DEBUG } from '@glimmer/env';
import { getWithDefault } from '@ember/object';
import config from 'ember-get-config';

import { validationDecorator } from '@ember-decorators/arguments/-debug';

export { immutable, required, type } from '@ember-decorators/arguments/-debug';

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
    validations.typeRequired = getWithDefault(config, 'emberArgumentDecorators.typeRequired', false);
  }

  // always ensure the property is writeable, doesn't make sense otherwise (babel bug?)
  desc.writable = true;
  desc.configurable = true;

  if (desc.initializer === null) return;

  const initializers = getOrCreateInitializersFor(target);
  initializers[key] = desc.initializer;

  desc.initializer = function() {
    let value;

    if(this.hasOwnProperty(key) === true) {
      value = this[key];
    } else {
      const initializers = getInitializersFor(Object.getPrototypeOf(this));
      value = initializers[key].call(this);
    }

    return value;
  }
}

if (DEBUG) {
  argument = validationDecorator(argument);
}

export { argument };
