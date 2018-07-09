import { assert } from '@ember/debug';
import { resolveValidator, makeValidator } from '../utils/validators';

const nullValidator = resolveValidator(null);
const undefinedValidator = resolveValidator(undefined);

export default function optional(type) {
  assert(`The 'optional' helper must receive exactly one type. Use the 'unionOf' helper to create a union type.`, arguments.length === 1);

  const validator = resolveValidator(type);
  const validatorDesc = validator.toString();

  assert(`Passsing 'null' to the 'optional' helper does not make sense.`, validatorDesc !== 'null');
  assert(`Passsing 'undefined' to the 'optional' helper does not make sense.`, validatorDesc !== 'undefined');

  return makeValidator(`optional(${validator})`, (value) =>
    nullValidator(value) || undefinedValidator(value) || validator(value)
  );
}
