import Component from '@ember/component';
import { assert } from '@ember/debug';
import { getWithDefault } from '@ember/object';
import config from 'ember-get-config';

import './utils/validation-decorator';

import { gte } from 'ember-compatibility-helpers';

import { getValidationsFor } from './utils/validations-for';

let validatedComponent;

const whitelist = {
  ariaRole: true,
  class: true,
  classNames: true,
  id: true,
  isVisible: true,
  tagName: true,
  __ANGLE_ATTRS__: true
};

if (gte('1.13.0')) {
  validatedComponent = Component.extend()

  validatedComponent.reopenClass({
    create(props) {
      // First create the instance to realize any dynamically added bindings or fields
      const instance = this._super(...arguments);

      const prototype = Object.getPrototypeOf(instance);
      const validations = getValidationsFor(prototype) || {};
      if (
        getWithDefault(config, '@ember-decorators/argument.ignoreComponentsWithoutValidations', false) &&
        Object.keys(validations).length === 0
      ) {
        return instance;
      }

      const attributes = (instance.attributeBindings || []);
      const classNames = (instance.classNameBindings || []).map((binding) => binding.split(':')[0]);

      for (let key in props.attrs) {
        const isValidArgOrAttr =
          (key in validations && validations[key].isArgument)
          || key in whitelist
          || attributes.indexOf(key) !== -1
          || classNames.indexOf(key) !== -1;

        assert(
          `Attempted to assign the argument '${key}' on an instance of ${this.name || this}, but no argument was defined for that key. Use the @argument helper on the class field to define an argument for that class.`,
          isValidArgOrAttr
        );
      }

      return instance;
    }
  });
} else {
  validatedComponent = Component;
}

export default validatedComponent;
