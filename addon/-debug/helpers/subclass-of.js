import { assert } from '@ember/debug';
import { makeValidator } from '../utils/validators';

export default function subclassOf(superclass) {
  assert(`The 'subclassOf' helper must receive exactly one class`, arguments.length === 1);
  assert(`The 'subclassOf' helper must receive a class constructor, received: ${superclass}`, typeof superclass === 'function');

  return makeValidator(`subclassOf(${superclass})`, (value) => {
    return (
      typeof value === 'object'
      && value !== null
      && Object.getPrototypeOf(value) instanceof superclass
    );
  });
}
