import BaseValidator from './-base';

export default class TypeMatchValidator extends BaseValidator {
  constructor(type) {
    super();

    this.type = type;
  }

  toString() {
    return this.type;
  }

  check(value) {
    return typeof value === this.type;
  }
}

export const BOOLEAN = new TypeMatchValidator('boolean');

export const NUMBER = new TypeMatchValidator('number');

export const STRING = new TypeMatchValidator('string');

export const SYMBOL = new TypeMatchValidator('symbol');
