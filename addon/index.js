import { assert } from '@ember/debug';

import resolveValidator from './-private/resolve-validator';
import { addValidationFor } from './-private/validations-for';
import {
  hasExtension as hasValidationExtension,
  withExtension as withValidationExtension
} from './-private/extensions/with-validation';
import {
  needsExtension as needsComponentExtension,
  hasExtension as hasComponentExtension,
  withExtension as withComponentExtension
} from './-private/extensions/prevent-additional-arguments';

export function argument(typeDefinition) {
  assert(
    'A type definition must be provided to `@argument`',
    typeof typeDefinition !== 'undefined'
  );
  assert(
    '`@argument` must be passed a type to validate against',
    !(typeDefinition instanceof Object && typeof arguments[1] === 'string')
  );
  assert(
    '`@argument` must only be passed one type definition',
    arguments.length === 1
  );

  const validator = resolveValidator(typeDefinition);

  return (target, key, desc) => {
    let klass = target.constructor;
    addValidationFor(klass, key, validator);

    if (!hasValidationExtension(klass)) {
      withValidationExtension(klass);
    }

    if (!hasComponentExtension(klass) && needsComponentExtension(klass)) {
      withComponentExtension(klass);
    }

    return desc;
  };
}
