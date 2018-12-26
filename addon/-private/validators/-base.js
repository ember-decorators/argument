export default class BaseValidator {
  check() {
    throw new Error('Subclass must implement a `check` method');
  }

  formatValue(value) {
    return typeof value === 'string' ? `'${value}'` : value;
  }

  run(klass, key, value, phase) {
    if (this.check(value) === false) {
      let formattedValue = this.formatValue(value);

      throw new Error(
        `${
          klass.name
        }#${key} expected value of type ${this} during '${phase}', but received: ${formattedValue}`
      );
    }
  }
}
