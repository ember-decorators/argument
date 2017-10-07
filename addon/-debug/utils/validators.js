import { assert } from '@ember/debug';
import isClass from './is-class';

function instanceOf(type) {
  return makeValidator(type.toString(), (value) => value instanceof type);
}

const primitiveTypeValidators = {
  action:    makeValidator('action', (value) => typeof value === 'string' || typeof value === 'function'),
  any:       makeValidator('any', () => true),
  array:     makeValidator('array', (value) => Array.isArray(value)),
  class:     makeValidator('class', isClass),

  boolean:   makeValidator('boolean', (value) => typeof value === 'boolean'),
  function:  makeValidator('function', (value) => typeof value === 'function'),
  number:    makeValidator('number', (value) => typeof value === 'number'),
  object:    makeValidator('object', (value) => typeof value === 'object'),
  string:    makeValidator('string', (value) => typeof value === 'string'),
  symbol:    makeValidator('symbol', (value) => typeof value === 'symbol'),

  null:      makeValidator('null', (value) => value === null),
  undefined: makeValidator('undefined', (value) => value === undefined)
}

export function makeValidator(desc, fn) {
  fn.isValidator = true;
  fn.toString = () => desc;
  return fn;
}

export function resolveValidator(type) {
  if (type.isValidator === true) {
    return type;
  } else if (typeof type === 'function') {
    return instanceOf(type);
  } else if (typeof type === 'string') {
    assert(`Unknown primitive type received: ${type}`, primitiveTypeValidators[type] !== undefined);

    return primitiveTypeValidators[type];
  } else {
    assert(`Types must either be a primitive type string, a class, or a validator, received: ${type}`, false);
  }
}