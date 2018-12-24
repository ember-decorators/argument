/**
 * Transforms a `field` descriptor into a property `getter/setter` that
 * ensures that the value matches the validators.
 *
 * @param {Object} element
 * @param {Function} validator
 */
function wrapFieldDescriptor(
  { descriptor, initializer, key, placement },
  validator
) {
  const { ...descriptorToApply } = descriptor;
  delete descriptorToApply.writable;

  let initialized = false;
  let cachedValue;

  const newElement = {
    key,
    placement,
    kind: 'method',
    descriptor: {
      ...descriptorToApply,
      get() {
        if (!initialized) {
          initialized = true;
          cachedValue = initializer ? initializer.call(this) : undefined;
        }

        return cachedValue;
      },
      set(newValue) {
        initialized = true;

        validator.run(this.constructor, key, newValue, 'set');

        cachedValue = newValue;
      }
    }
  };

  return newElement;
}

/**
 * Wraps a property `getter/setter` such that the value must match the
 * validator.
 *
 * @param {Object} element
 * @param {Function} validator
 */
function wrapMethodDescriptor({ descriptor, key, ...rest }, validator) {
  const { get, set, ...restOfDescriptor } = descriptor;

  const newElement = {
    ...rest,
    key,
    descriptor: {
      ...restOfDescriptor,
      get() {
        const value = get.call(this);

        validator.run(this.constructor, key, value, 'get');

        return value;
      },
      set(newValue) {
        const setterReturnedValue = set.call(this, newValue);

        validator.run(this.constructor, key, this[key], 'set');

        return setterReturnedValue;
      }
    }
  };

  return newElement;
}

/**
 * Wrap a property in a `getter/setter` that validates it is the right
 * type.
 *
 * @param {Object} element
 * @param {Function} validator validator function for new values
 */
export default function wrapDescriptor(element, validator) {
  switch (element.kind) {
    case 'field':
      return wrapFieldDescriptor(element, validator);
    case 'method':
      return wrapMethodDescriptor(element, validator);
    default:
      throw new Error(
        '`@argument` must be applied to a `field` or property accessor'
      );
  }
}
