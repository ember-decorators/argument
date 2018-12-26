import { isArray } from '@ember/array';
import { assert } from '@ember/debug';

import resolveValidator from '../resolve-validator';
import BaseValidator from '../validators/-base';

class ArrayOfValidator extends BaseValidator {
  constructor(validator) {
    super();

    this.validator = validator;
  }

  toString() {
    return `arrayOf(${this.validator})`;
  }

  check(value) {
    return isArray(value) && value.every(value => this.validator.check(value));
  }
}

export default function arrayOf(type) {
  assert(
    `The 'arrayOf' helper must receive exactly one type. Use the 'unionOf' helper to create a union type.`,
    arguments.length === 1
  );

  const validator = resolveValidator(type);

  return new ArrayOfValidator(validator);
}
