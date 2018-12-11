export function isMandatorySetter(setter) {
  return setter && setter.toString().match('You must use .*set()') !== null;
}

/**
 * Recognizes objects that are Ember property descriptors
 *
 * @parom {object} maybeDesc
 * @return {boolean}
 */
export function isEmberDescriptor(maybeDesc) {
  return (
    maybeDesc !== null &&
    typeof maybeDesc === 'object' &&
    maybeDesc.isDescriptor
  );
}

export function isDescriptorTrap(maybeDesc) {
  return (
    maybeDesc !== null &&
    typeof maybeDesc === 'object' &&
    !!maybeDesc.__DESCRIPTOR__
  );
}
