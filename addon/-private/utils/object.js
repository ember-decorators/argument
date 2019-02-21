export function isExtensionOf(childClass, parentClass) {
  return childClass.prototype instanceof parentClass;
}
