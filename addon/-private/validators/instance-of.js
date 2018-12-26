import BaseValidator from './-base';

export default class InstanceOfValidator extends BaseValidator {
  constructor(klass) {
    super();

    this.klass = klass;
  }

  formatValue(value) {
    if (value === null) {
      return `null`;
    }

    if (value === undefined) {
      return `undefined`;
    }

    return `an instance of \`${value.constructor.name}\``;
  }

  toString() {
    return `\`${this.klass.name}\``;
  }

  check(value) {
    return value instanceof this.klass;
  }
}
