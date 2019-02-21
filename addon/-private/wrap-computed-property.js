function guardBind(fn, ...args) {
  if (typeof fn === 'function') {
    return fn.bind(...args);
  }
}

class ComputedValidatedProperty {
  constructor(desc, klass, originalValue, typeValidators) {
    this.isDescriptor = true;

    this.desc = desc;
    this.klass = klass;
    this.originalValue = originalValue;
    this.typeValidators = typeValidators;

    this.setup = guardBind(desc.setup, desc);
    this.teardown = guardBind(desc.teardown, desc);
    this.willChange = guardBind(desc.willChange, desc);
    this.didChange = guardBind(desc.didChange, desc);
    this.willWatch = guardBind(desc.willWatch, desc);
    this.didUnwatch = guardBind(desc.didUnwatch, desc);
  }

  get(obj, keyName) {
    let { klass, typeValidators } = this;
    let newValue = this.desc.get(obj, keyName);

    if (typeValidators) {
      typeValidators.run(klass, keyName, newValue, 'get');
    }

    return newValue;
  }

  set(obj, keyName, value) {
    let { klass, typeValidators } = this;
    let newValue = this.desc.set(obj, keyName, value);

    if (typeValidators) {
      typeValidators.run(klass, keyName, newValue, 'set');
    }

    return newValue;
  }
}

export function isComputedProperty(meta, key) {
  const possibleDesc = meta.peekDescriptors(key);

  return possibleDesc && possibleDesc.isDescriptor;
}

export function wrapComputedProperty(
  klass,
  instance,
  meta,
  typeValidators,
  key
) {
  const desc = meta.peekDescriptors(key);

  let originalValue = desc.get(instance, key);

  let validatedProperty = new ComputedValidatedProperty(
    desc,
    klass,
    originalValue,
    typeValidators
  );

  Object.defineProperty(instance, key, {
    configurable: true,
    enumerable: true,
    get() {
      return validatedProperty.get(instance, key);
    }
  });

  meta.writeDescriptors(key, validatedProperty);
}
