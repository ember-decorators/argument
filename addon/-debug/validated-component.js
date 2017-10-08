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
      const validations = HAS_MODERN_FACTORY_INJECTIONS ? validationsFor(this.prototype) : validationsFor(this.__super__);

      for (let key in props.attrs) {
        assert(
          `Attempted to assign '${key}' value on a ${this} component, but no argument was defined for that key. Use the @argument helper on the class field to define an argument which can be passed into the component`,
          (key in validations && validations[key].isArgument) || key in whitelist
        );
      }

      return this._super(...arguments);
    }
  });
} else {
  validatedComponent = Component;
}

export default validatedComponent;
