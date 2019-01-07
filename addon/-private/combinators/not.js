import BaseValidator from '../validators/-base';

export class NotValidator extends BaseValidator {
  constructor(validator) {
    super();

    this.validator = validator;
  }

  check(value) {
    return !this.validator.check(value);
  }
}

export default function not(validator) {
  return new NotValidator(validator);
}
