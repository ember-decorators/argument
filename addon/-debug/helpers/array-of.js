import { assert } from '@ember/debug';
import { resolveValidator, makeValidator } from '../utils/validators';

export default function arrayOf(type) {
  assert(`The 'arrayOf' helper must receive exactly one type. Use the 'unionOf' helper to create a union type.`, arguments.length === 1);

  const validator = resolveValidator(type);

  return makeValidator(`arrayOf(${validator})`, (value) => {
    return Array.isArray(value) && value.every(validator);
  });
}

