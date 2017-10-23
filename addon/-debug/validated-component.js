import Component from '@ember/component';
import { assert } from '@ember/debug';

import {
  GTE_EMBER_1_13,
  HAS_MODERN_FACTORY_INJECTIONS
} from 'ember-compatibility-helpers';

import { validationsFor } from '@ember-decorators/utils/debug';

let validatedComponent;

const whitelist = {
  id: true,
  tagName: true,
  class: true
};

if (GTE_EMBER_1_13) {
  validatedComponent = Component.extend()

  validatedComponent.reopenClass({
    create(props) {
      const prototype = HAS_MODERN_FACTORY_INJECTIONS ? this.prototype : this.__super__;
      const validations = validationsFor(prototype);
      const attributes = (prototype.attributeBindings || []);
      const classNames = (prototype.classNameBindings || []).map((binding) => binding.split(':')[0]);

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

      return this._super(...arguments);
    }
  });
} else {
  validatedComponent = Component;
}

export default validatedComponent;
