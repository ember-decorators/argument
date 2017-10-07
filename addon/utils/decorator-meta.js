const decoratorMetaMap = new WeakMap();

export function decoratorMetaFor(target) {
  if (!decoratorMetaMap.has(target)) {
    const parentMeta = decoratorMetaMap.get(Object.getPrototypeOf(target));
    decoratorMetaMap.set(target, Object.create(parentMeta || Object));
  }

  return decoratorMetaMap.get(target);
}

export function validationsFor(target) {
  const meta = decoratorMetaFor(target);

  if (!meta.hasOwnProperty('validations')) {
    const parentValidations = meta.validations || null;
    meta.validations = Object.create(parentValidations);
  }

  return meta.validations;
}
