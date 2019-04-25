import collapseProto from '@ember-decorators/utils/collapse-proto';
import { afterMethod } from 'patch-method';

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

  collapseProto(klass.prototype);

  afterMethod(klass, 'init', function() {
    const validations = getValidationsFor(this.constructor);

    for (let key in validations) {
      wrapField(this.constructor, this, validations, key);
    }
  });
}
