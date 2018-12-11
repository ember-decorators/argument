import { assert } from '@ember/debug';
import { makeValidator } from '../validators';

export default function oneOf(...list) {
  assert(
    `The 'oneOf' helper must receive at least one argument`,
    arguments.length >= 1
  );
  assert(
    `The 'oneOf' helper must receive arguments of strings, received: ${list}`,
    list.every(item => typeof item === 'string')
  );

  return makeValidator(`oneOf(${list.join()})`, value => {
    return list.includes(value);
  });
}
