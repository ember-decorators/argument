const validationMetaMap = new WeakMap();

class FieldValidations {
  constructor(parentValidations = null) {
    if (parentValidations === null) {
      this.isRequired = false;
      this.isImmutable = false;
      this.isArgument = false;
      this.typeRequired = false;

      this.typeValidators = [];
    } else {
      const {
        isRequired,
        isImmutable,
        isArgument,
        typeRequired,
        typeValidators
      } = parentValidations;

      this.isRequired = isRequired;
      this.isImmutable = isImmutable;
      this.isArgument = isArgument;
      this.typeRequired = typeRequired;

      this.typeValidators = typeValidators.slice();
    }
  }
}

export function getValidationsFor(target) {
  // Reached the root of the prototype chain
  if (target === null) return;

  return validationMetaMap.get(target) || getValidationsFor(Object.getPrototypeOf(target));
}

export function getOrCreateValidationsFor(target) {
  if (!validationMetaMap.has(target)) {
    const parentMeta = getValidationsFor(Object.getPrototypeOf(target));
    validationMetaMap.set(target, Object.create(parentMeta || null));
  }

  return validationMetaMap.get(target);
}

export function getValidationsForKey(target, key) {
  const validations = getOrCreateValidationsFor(target);

  if (!Object.hasOwnProperty.call(validations, key)) {
    const parentValidations = validations[key];
    validations[key] = new FieldValidations(parentValidations);
  }

  return validations[key];
}
