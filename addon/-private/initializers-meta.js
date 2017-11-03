const initializersMap = new WeakMap();

export function getOrCreateInitializersFor(target) {
  if (!initializersMap.has(target)) {
    const parentInitializers = getInitializersFor(Object.getPrototypeOf(target));
    initializersMap.set(target, Object.create(parentInitializers || null));
  }

  return initializersMap.get(target);
}

export function getInitializersFor(target) {
  // Reached the root of the prototype chain
  if (target === null) return target;

  return initializersMap.get(target) || getInitializersFor(Object.getPrototypeOf(target));
}
