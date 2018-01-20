export function getPropertyDescriptor(object, key) {
  if (object === undefined) return;

  return Object.getOwnPropertyDescriptor(object, key) || getPropertyDescriptor(Object.getPrototypeOf(object), key);
}
