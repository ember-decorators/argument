import Ember from 'ember';

import {
  isComputedProperty,
  wrapComputedProperty
} from '../wrap-computed-property';
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

      const { constructor } = this;

      const validations = getValidationsFor(constructor);
      const meta = Ember.meta(this);

      for (let key in validations) {
        const validation = validations[key];

        if (isComputedProperty(meta, key)) {
          wrapComputedProperty(constructor, this, meta, validation, key);
        }

        validation.run(constructor, key, this[key], 'init');
      }
    }
  };
}
