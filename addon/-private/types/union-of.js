import { assert } from '@ember/debug';

import resolveValidator from '../resolve-validator';
import { OrValidator } from '../combinators/or';

class UnionOfValidator extends OrValidator {
  toString() {
    return `unionOf(${this.validators.join()})`;
  }
}

export default function unionOf(...types) {
  assert(
    `The 'unionOf' helper must receive more than one type`,
    arguments.length > 1
  );

  const validators = types.map(resolveValidator);

  return new UnionOfValidator(...validators);
}
