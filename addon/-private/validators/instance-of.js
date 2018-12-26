import BaseValidator from './-base';

export default class InstanceOfValidator extends BaseValidator {
  constructor(klass) {
    super();

    this.klass = klass;
  }

  toString() {
    return `\`${this.klass.name}\``;
  }

  check(value) {
    return value instanceof this.klass;
  }
}
