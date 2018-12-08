export function isMandatorySetter(setter) {
  return setter && setter.toString().match('You must use .*set()') !== null;
}

export function isDescriptor(maybeDesc) {
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
