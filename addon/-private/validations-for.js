const VALIDATION_MAP = new WeakMap();

/**
 * Recursively get all validations for the given class, and all parent classes
 */
export function getValidationsFor(klass) {
  const klassValidations = VALIDATION_MAP.get(klass) || {};
  const prototype = Object.getPrototypeOf(klass);
  let prototypeValidations = {};

  if (prototype) {
    prototypeValidations = getValidationsFor(prototype);
  }

  // Note: order is important to ensure that a subclass cannot override
  // the type of an argument
  return { ...klassValidations, ...prototypeValidations };
}

export function addValidationFor(klass, prop, validator) {
  let validators;

  if (VALIDATION_MAP.has(klass)) {
    validators = VALIDATION_MAP.get(klass);
  } else {
    validators = {};
  }

  validators[prop] = validator;

  VALIDATION_MAP.set(klass, validators);
}
