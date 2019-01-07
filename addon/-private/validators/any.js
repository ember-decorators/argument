import BaseValidator from './-base';

export default class AnyValidator extends BaseValidator {
  check() {
    return true;
  }
}
