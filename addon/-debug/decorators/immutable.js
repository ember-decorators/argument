import validationDecorator from '../utils/validation-decorator';

const immutable = validationDecorator(function(target, key, desc, validations) {
  validations.isImmutable = true;
});

export default immutable;
