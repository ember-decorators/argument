import { assert } from '@ember/debug';
import { get } from '@ember/object';

import resolveValidator from '../resolve-validator';
import BaseValidator from '../validators/-base';

class ShapeOfValidator extends BaseValidator {
  constructor(shape) {
    super();

    this.shape = {};
    this.typeDesc = [];

    for (let key in shape) {
      this.shape[key] = resolveValidator(shape[key]);

      this.typeDesc.push(`${key}:${shape[key]}`);
    }
  }

  toString() {
    return `shapeOf({${this.typeDesc.join()}})`;
  }

  check(value) {
    for (let key in this.shape) {
      if (this.shape[key].check(get(value, key)) !== true) {
        return false;
      }
    }

    return true;
  }
}

export default function shapeOf(shape) {
  assert(
    `The 'shapeOf' helper must receive exactly one shape`,
    arguments.length === 1
  );
  assert(
    `The 'shapeOf' helper must receive an object to match the shape to, received: ${shape}`,
    typeof shape === 'object'
  );
  assert(
    `The object passed to the 'shapeOf' helper must have at least one key:type pair`,
    Object.keys(shape).length > 0
  );

  return new ShapeOfValidator(shape);
}
