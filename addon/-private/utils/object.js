/**
 * Walk up the prototype chain and find the property descriptor for the
 * given property
 *
 * @param {object} target
 * @param {string} property
 * @return {Descriptor|undefined}
 */
export function getPropertyDescriptor(target, property) {
  if (target === undefined || target === null) return;

  return (
    Object.getOwnPropertyDescriptor(target, property) ||
    getPropertyDescriptor(Object.getPrototypeOf(target), property)
  );
}

export function isExtensionOf(childClass, parentClass) {
  return childClass.prototype instanceof parentClass;
}
