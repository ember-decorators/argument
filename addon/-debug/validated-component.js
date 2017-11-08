import Component from '@ember/component';
import { assert } from '@ember/debug';
import { getWithDefault } from '@ember/object';
import config from 'ember-get-config';

import './utils/validation-decorator';

import {
  GTE_EMBER_1_13,
  HAS_MODERN_FACTORY_INJECTIONS
} from 'ember-compatibility-helpers';

import { getValidationsFor } from './utils/validations-for';

let validatedComponent;

const whitelist = {
  ariaRole: true,
  class: true,
  classNames: true,
  id: true,
  isVisible: true,
  tagName: true
};

if (GTE_EMBER_1_13) {
  validatedComponent = Component.extend()

  validatedComponent.reopenClass({
    create(props) {
      // First create the instance to realize any dynamically added bindings or fields
      const instance = this._super(...arguments);

      const prototype = HAS_MODERN_FACTORY_INJECTIONS ? this.prototype : this.__super__;
      const validations = getValidationsFor(prototype) || {};
      if (
        getWithDefault(config, 'emberDecoratorsArgument.ignoreComponentsWithoutValidations', false) &&
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
          `Attempted to assign '${key}' value on a ${this} component, but no argument was defined for that key. Use the @argument helper on the class field to define an argument which can be passed into the component`,
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
