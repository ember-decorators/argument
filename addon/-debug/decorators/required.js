import validationDecorator from '../utils/validation-decorator';

const required = validationDecorator(function(target, key, desc, validations) {
  validations.isRequired = true;
});

export default required;
