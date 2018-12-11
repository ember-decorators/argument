import { wrapField } from '../wrap-field';
import { getValidationsFor } from '../validations-for';

const HAS_VALIDATION = Symbol();

export function hasExtension(klass) {
  return klass[HAS_VALIDATION];
}

/**
 * Extend the class using native classes to inject validation logic
 */
export function withExtension(klass) {
  if (klass[HAS_VALIDATION]) {
    return klass;
  }

  klass[HAS_VALIDATION] = true;

  return class extends klass {
    init(...args) {
      super.init(...args);

      const validations = getValidationsFor(this.constructor);

      for (let key in validations) {
        wrapField(this.constructor, this, validations, key);
      }
    }
  };
}
