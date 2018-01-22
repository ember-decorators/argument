import { computed } from '@ember/object';

import { SUPPORTS_NEW_COMPUTED } from 'ember-compatibility-helpers';

export function makeComputed(desc) {
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

export function isMandatorySetter(setter) {
  return setter && setter.toString().match('You must use .*set()') !== null;
}

export function isDescriptor(maybeDesc) {
  return maybeDesc !== null && typeof maybeDesc === 'object' && maybeDesc.isDescriptor;
}

export function isDescriptorTrap(maybeDesc) {
  return maybeDesc !== null && typeof maybeDesc === 'object' && !!maybeDesc.__DESCRIPTOR__;
}
