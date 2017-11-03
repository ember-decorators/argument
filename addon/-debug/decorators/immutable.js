import validationDecorator from '../utils/validation-decorator';

const immutable = validationDecorator(function(target, key, desc, options, validations) {
  validations.isImmutable = true;
});

export default immutable;
