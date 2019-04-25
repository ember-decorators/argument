import Ember from 'ember';
import { notifyPropertyChange } from '@ember/object';

import {
  isMandatorySetter,
  isEmberDescriptor,
  isDescriptorTrap
} from './utils/computed';
import { getPropertyDescriptor } from './utils/object';

function guardBind(fn, ...args) {
  if (typeof fn === 'function') {
    return fn.bind(...args);
  }
}

class ValidatedProperty {
  constructor({ originalValue, klass, keyName, typeValidators }) {
    this.isDescriptor = true;

    this.klass = klass;
    this.originalValue = originalValue;
    this.typeValidators = typeValidators;

    typeValidators.run(klass, keyName, originalValue, 'init');
  }

  get(obj, keyName) {
    let { klass, typeValidators } = this;
    let newValue = this._get(obj, keyName);

    if (typeValidators) {
      typeValidators.run(klass, keyName, newValue, 'get');
    }

    return newValue;
  }

  set(obj, keyName, value) {
    let { klass, typeValidators } = this;
    let newValue = this._set(obj, keyName, value);

    if (typeValidators) {
      typeValidators.run(klass, keyName, newValue, 'set');
    }

    return newValue;
  }
}

class StandardValidatedProperty extends ValidatedProperty {
  constructor({ originalValue }) {
    super(...arguments);

    this.cachedValue = originalValue;
  }

  _get() {
    return this.cachedValue;
  }

  _set(obj, keyName, value) {
    if (value === this.cachedValue) return value;

    this.cachedValue = value;

    notifyPropertyChange(obj, keyName);

    return this.cachedValue;
  }
}

class NativeComputedValidatedProperty extends ValidatedProperty {
  constructor({ desc }) {
    super(...arguments);

    this.desc = desc;
  }

  _get(obj) {
    return this.desc.get.call(obj);
  }

  _set(obj, keyName, value) {
    // By default Ember.get will check to see if the value has changed before setting
    // and calling propertyDidChange. In order to not change behavior, we must do the same
    let currentValue = this._get(obj);

    if (value === currentValue) return value;

    this.desc.set.call(obj, value);

    notifyPropertyChange(obj, keyName);

    return this._get(obj);
  }
}

class ComputedValidatedProperty extends ValidatedProperty {
  constructor({ desc }) {
    super(...arguments);

    this.desc = desc;

    this.setup = guardBind(desc.setup, desc);
    this.teardown = guardBind(desc.teardown, desc);
    this.willChange = guardBind(desc.willChange, desc);
    this.didChange = guardBind(desc.didChange, desc);
    this.willWatch = guardBind(desc.willWatch, desc);
    this.didUnwatch = guardBind(desc.didUnwatch, desc);
  }

  _get(obj, keyName) {
    return this.desc.get(obj, keyName);
  }

  _set(obj, keyName, value) {
    return this.desc.set(obj, keyName, value);
  }
}

export function wrapField(klass, instance, validations, keyName) {
  const typeValidators = validations[keyName];

  let originalValue = instance[keyName];
  let meta = Ember.meta(instance);
  let possibleDesc = meta.peekDescriptors(keyName);

  if (possibleDesc !== undefined) {
    originalValue = possibleDesc;
  }

  if (isDescriptorTrap(originalValue)) {
    originalValue = originalValue.__DESCRIPTOR__;
  }

  let validatedProperty;

  if (isEmberDescriptor(originalValue)) {
    let desc = originalValue;

    originalValue = desc.get(instance, keyName);

    validatedProperty = new ComputedValidatedProperty({
      desc,
      keyName,
      klass,
      originalValue,
      typeValidators
    });
  } else {
    let desc = getPropertyDescriptor(instance, keyName);

    if (
      typeof desc === 'object' &&
      (typeof desc.get === 'function' || typeof desc.set === 'function') &&
      !isMandatorySetter(desc.set)
    ) {
      validatedProperty = new NativeComputedValidatedProperty({
        desc,
        keyName,
        klass,
        originalValue,
        typeValidators
      });
    } else {
      validatedProperty = new StandardValidatedProperty({
        keyName,
        klass,
        originalValue,
        typeValidators
      });
    }
  }

  Object.defineProperty(instance, keyName, {
    configurable: true,
    enumerable: true,
    get() {
      return validatedProperty.get(this, keyName);
    }
  });

  meta.writeDescriptors(keyName, validatedProperty);
}
