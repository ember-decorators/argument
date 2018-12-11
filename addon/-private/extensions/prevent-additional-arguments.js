import Component from '@ember/component';
import { assert } from '@ember/debug';

import { getValidationsFor } from '../validations-for';
import { isExtensionOf } from '../utils/object';

const HAS_EXTENSION = Symbol();

const whitelist = {
  ariaRole: true,
  class: true,
  classNames: true,
  id: true,
  isVisible: true,
  tagName: true,
  target: true,
  __ANGLE_ATTRS__: true
};

export function needsExtension(klass) {
  return isExtensionOf(klass, Component);
}

export function hasExtension(klass) {
  return klass[HAS_EXTENSION];
}

export function withExtension(klass) {
  return class extends klass {
    init(...args) {
      super.init(...args);

      const validations = getValidationsFor(this.constructor) || {};

      if (Object.keys(validations).length === 0) {
        return;
      }

      const attributes = this.attributeBindings || [];
      const classNames = (this.classNameBindings || []).map(
        binding => binding.split(':')[0]
      );

      for (let key in this.attrs) {
        const isValidArgOrAttr =
          key in validations ||
          key in whitelist ||
          attributes.indexOf(key) !== -1 ||
          classNames.indexOf(key) !== -1;

        assert(
          `Attempted to assign the argument '${key}' on an instance of ${
            this.constructor.name
          }, but no argument was defined for that key. Use the @argument helper on the class field to define an argument for that class.`,
          isValidArgOrAttr
        );
      }
    }
  };
}
