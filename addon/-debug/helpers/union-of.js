import { assert } from '@ember/debug';
import { resolveValidator, makeValidator } from '../utils/validators';

export default function unionOf(...types) {
  assert(
    `The 'unionOf' helper must receive more than one type`,
    arguments.length > 1
  );

  const validators = types.map(resolveValidator);

  return makeValidator(`unionOf(${validators.join()})`, value => {
    return validators.some(validator => validator(value));
  });
}
