import Component from '@ember/component';
import { assert } from '@ember/debug';
import collapseProto from '@ember-decorators/utils/collapse-proto';
import { afterMethod } from 'patch-method';

import { argumentWhitelist } from '../config';
import { getValidationsFor } from '../validations-for';
import { isExtensionOf } from '../utils/object';

const HAS_EXTENSION = new WeakSet();

const whitelist = [
  'ariaRole',
  'class',
  'classNames',
  'id',
  'isVisible',
  'tagName',
  'target',
  '__ANGLE_ATTRS__',
  ...argumentWhitelist
];

export function needsExtension(klass) {
  return isExtensionOf(klass, Component);
}

export function hasExtension(klass) {
  return HAS_EXTENSION.has(klass);
}

export function withExtension(klass) {
  HAS_EXTENSION.add(klass);

  collapseProto(klass.prototype);

  afterMethod(klass, 'init', function() {
    const validations = getValidationsFor(this.constructor) || {};

    if (Object.keys(validations).length === 0) {
      return;
    }

    const attributes = this.attributeBindings || [];
    const classNames = (this.classNameBindings || []).map(
      binding => binding.split(':')[0]
    );

    const expectedArguments = [
      ...attributes,
      ...classNames,
      ...Object.keys(validations),
      ...whitelist
    ];

    for (let key in this.attrs) {
      const isValidArgOrAttr = expectedArguments.some(matcher =>
        key.match(matcher)
      );

      assert(
        `Attempted to assign the argument '${key}' on an instance of ${
          this.constructor.name
        }, but no argument was defined for that key. Use the @argument helper on the class field to define an argument for that class.`,
        isValidArgOrAttr
      );
    }
  });
}
