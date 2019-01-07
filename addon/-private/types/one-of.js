import { assert } from '@ember/debug';

import { OrValidator } from '../combinators/or';
import ValueMatchValidator from '../validators/value-match';

class OneOfValidator extends OrValidator {
  toString() {
    return `oneOf(${this.validators.join()})`;
  }
}

export default function oneOf(...list) {
  assert(
    `The 'oneOf' helper must receive at least one argument`,
    arguments.length >= 1
  );
  assert(
    `The 'oneOf' helper must receive arguments of strings, received: ${list}`,
    list.every(item => typeof item === 'string')
  );

  const validators = list.map(value => new ValueMatchValidator(value));

  return new OneOfValidator(...validators);
}
