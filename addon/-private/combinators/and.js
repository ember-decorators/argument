import BaseValidator from '../validators/-base';

export class AndValidator extends BaseValidator {
  constructor(...validators) {
    super();

    this.validators = validators;
  }

  check(value) {
    return this.validators.reduce(
      (acc, validator) => acc && validator.check(value),
      true
    );
  }
}

export default function and(...validators) {
  return new AndValidator(...validators);
}
