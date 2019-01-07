import { assert } from '@ember/debug';

import resolveValidator from '../resolve-validator';
import {
  NULL as NULL_VALUE,
  UNDEFINED as UNDEFINED_VALUE
} from '../validators/value-match';
import { OrValidator } from '../combinators/or';

class OptionalValidator extends OrValidator {
  constructor(validator) {
    super(NULL_VALUE, UNDEFINED_VALUE, validator);

    this.originalValidator = validator;
  }

  toString() {
    return `optional(${this.originalValidator})`;
  }
}

export default function optional(type) {
  assert(
    `The 'optional' helper must receive exactly one type. Use the 'unionOf' helper to create a union type.`,
    arguments.length === 1
  );

  const validator = resolveValidator(type);

  assert(
    `Passsing 'null' to the 'optional' helper does not make sense.`,
    validator.toString() !== 'null'
  );
  assert(
    `Passsing 'undefined' to the 'optional' helper does not make sense.`,
    validator.toString() !== 'undefined'
  );

  return new OptionalValidator(validator);
}
