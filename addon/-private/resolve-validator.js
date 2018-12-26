import { assert } from '@ember/debug';

import AnyValidator from './validators/any';
import BaseValidator from './validators/-base';
import InstanceOfValidator from './validators/instance-of';
import {
  BOOLEAN as BOOLEAN_TYPE,
  NUMBER as NUMBER_TYPE,
  STRING as STRING_TYPE,
  SYMBOL as SYMBOL_TYPE
} from './validators/type-match';
import {
  NULL as NULL_VALUE,
  UNDEFINED as UNDEFINED_VALUE
} from './validators/value-match';
import { not, or } from './combinators/index';

const primitiveTypeValidators = {
  any: new AnyValidator('any'),
  object: not(
    or(
      BOOLEAN_TYPE,
      NUMBER_TYPE,
      STRING_TYPE,
      SYMBOL_TYPE,
      NULL_VALUE,
      UNDEFINED_VALUE
    )
  ),

  boolean: BOOLEAN_TYPE,
  number: NUMBER_TYPE,
  string: STRING_TYPE,
  symbol: SYMBOL_TYPE,

  null: NULL_VALUE,
  undefined: UNDEFINED_VALUE
};

export default function resolveValidator(type) {
  if (type === null) {
    return NULL_VALUE;
  } else if (type === undefined) {
    return UNDEFINED_VALUE;
  } else if (type instanceof BaseValidator) {
    return type;
  } else if (typeof type === 'function' || typeof type === 'object') {
    // We allow objects for certain classes in IE, like Element, which have typeof 'object' for some reason
    return new InstanceOfValidator(type);
  } else if (typeof type === 'string') {
    assert(
      `Unknown primitive type received: ${type}`,
      primitiveTypeValidators[type] !== undefined
    );

    return primitiveTypeValidators[type];
  } else {
    assert(
      `Types must either be a primitive type string, class, validator, or null or undefined, received: ${type}`,
      false
    );
  }
}
