import { wrapField } from '../wrap-field';
import { getValidationsFor } from '../validations-for';

const HAS_VALIDATION = new WeakSet();

export function hasExtension(klass) {
  return HAS_VALIDATION.has(klass);
}

/**
 * Extend the class using native classes to inject validation logic
 */
export function withExtension(klass) {
  HAS_VALIDATION.add(klass);

  return class extends klass {
    static get name() {
      return klass.name;
    }

    init(...args) {
      super.init(...args);

      const validations = getValidationsFor(this.constructor);

      for (let key in validations) {
        wrapField(this.constructor, this, validations, key);
      }
    }
  };
}
