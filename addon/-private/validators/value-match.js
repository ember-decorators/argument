import BaseValidator from './-base';

export default class ValueMatchValidator extends BaseValidator {
  constructor(value) {
    super();

    this.value = value;
  }

  toString() {
    return `${this.value}`;
  }

  check(value) {
    return this.value === value;
  }
}

export const NULL = new ValueMatchValidator(null);

export const UNDEFINED = new ValueMatchValidator(undefined);
