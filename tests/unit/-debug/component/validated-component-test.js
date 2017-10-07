import Ember from 'ember';
import Component from '@ember/component';

import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent } from 'ember-qunit';
import { test } from 'qunit';

import { GTE_EMBER_1_13 } from 'ember-compatibility-helpers';

import { argument } from 'ember-argument-decorators';

if (GTE_EMBER_1_13) {
  let originalTestAdapterException;

  moduleForComponent('validate component', {
      integration: true,
      beforeEach() {
          originalTestAdapterException = Ember.Test.adapter.exception;
          Ember.Test.adapter.exception = function(e) {
            throw e;
          };
      },
      afterEach() {
          Ember.Test.adapter.exception = originalTestAdapterException;
      }
   });

  test('asserts on attrs which are not defined', function(assert) {
    class FooComponent extends Component {}

    this.register('component:foo-component', FooComponent);

    assert.throws(() => {
      this.render(hbs`{{foo-component foo=123}}`);
    }, /Attempted to assign 'foo'/);
  });

  test('does not assert on attrs which are defined', function(assert) {
    assert.expect(0);

    class FooComponent extends Component {
      @argument foo;
    }

    this.register('component:foo-component', FooComponent);

    this.render(hbs`{{foo-component foo=123}}`);
  });
}
