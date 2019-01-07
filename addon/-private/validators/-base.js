function isPrimitive(value) {
  return (
    typeof value === 'boolean' ||
    typeof value === 'number' ||
    typeof value === 'string' ||
    typeof value === 'symbol'
  );
}

function formatSingleValue(value) {
  if (value === null) {
    return 'null';
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (isPrimitive(value)) {
    return typeof value === 'string' ? `'${value}'` : value;
  }

  return `an instance of \`${value.constructor.name}\``;
}

export default class BaseValidator {
  check() {
    throw new Error('Subclass must implement a `check` method');
  }

  formatValue(value) {
    if (Array.isArray(value)) {
      return `[${value.map(formatSingleValue).join(', ')}]`;
    }

    return formatSingleValue(value);
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
