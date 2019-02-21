import { assert } from '@ember/debug';

import resolveValidator from './-private/resolve-validator';
import { addValidationFor } from './-private/validations-for';
import wrapDescriptor from './-private/wrap-descriptor';
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
    typeDefinition.toString() !== '[object Descriptor]'
  );
  assert(
    '`@argument` must only be passed one type definition',
    arguments.length === 1
  );

  const validator = resolveValidator(typeDefinition);

  return desc => {
    const descriptorWithValidation = wrapDescriptor(desc, validator);

    return {
      ...descriptorWithValidation,
      finisher(klass) {
        addValidationFor(klass, desc.key, validator);

        if (!hasValidationExtension(klass)) {
          klass = withValidationExtension(klass);
        }

        if (!hasComponentExtension(klass) && needsComponentExtension(klass)) {
          klass = withComponentExtension(klass);
        }

        return klass;
      }
    };
  };
}
