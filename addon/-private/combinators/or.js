import BaseValidator from '../validators/-base';

export class OrValidator extends BaseValidator {
  constructor(...validators) {
    super();

    this.validators = validators;
  }

  check(value) {
    return this.validators.some(validator => validator.check(value));
  }
}

export default function or(...validators) {
  return new OrValidator(...validators);
}
