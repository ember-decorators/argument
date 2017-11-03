import { assert } from '@ember/debug';

import validationDecorator from '../utils/validation-decorator';
import { resolveValidator } from '../utils/validators';

export default function type(type) {
  assert(`The @type decorator can only receive one type, but instead received ${arguments.length}. Use the 'unionOf' helper to create a union type.`, arguments.length === 1);

  const validator = resolveValidator(type);

  return validationDecorator(function(target, key, desc, options, validations) {
    validations.typeValidators.push(validator);
  });
}
