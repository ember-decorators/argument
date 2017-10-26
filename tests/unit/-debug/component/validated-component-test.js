import Ember from 'ember';
import Component from '@ember/component';

import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent } from 'ember-qunit';
import { test } from 'qunit';

import { GTE_EMBER_1_13 } from 'ember-compatibility-helpers';

import { argument } from 'ember-argument-decorators';
import { attribute, className } from 'ember-decorators/component';

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

  test('asserts on args which are not defined', function(assert) {
    class FooComponent extends Component {}

    this.register('component:foo-component', FooComponent);

    assert.throws(() => {
      this.render(hbs`{{foo-component foo=123}}`);
    }, /Attempted to assign 'foo'/);
  });

  test('does not assert on args which are defined', function(assert) {
    assert.expect(0);

    class FooComponent extends Component {
      @argument foo;
    }

    this.register('component:foo-component', FooComponent);

    this.render(hbs`{{foo-component foo=123}}`);
  });

  test('does not assert on attributes which are defined', function(assert) {
    assert.expect(0);

    class FooComponent extends Component {
      @attribute foo;
    }

    this.register('component:foo-component', FooComponent);

    this.render(hbs`{{foo-component foo=123}}`);
  });

  test('does not assert on classNames which are defined', function(assert) {
    assert.expect(0);

    class FooComponent extends Component {
      @className foo;
    }

    this.register('component:foo-component', FooComponent);

    this.render(hbs`{{foo-component foo=123}}`);
  });

  test('does not assert on classNames or attributes which are defined dynamically', function(assert) {
    assert.expect(0);

    class FooComponent extends Component {
      constructor() {
        super(...arguments);

        this.attributeBindings = ['data-test'];
        this.classNameBindings = ['foo']
      }
    }

    this.register('component:foo-component', FooComponent);

    this.render(hbs`{{foo-component foo=123 data-test=true}}`);
  });

  test('does not assert on whitelisted arguments and attributes', function(assert) {
    assert.expect(0);

    class FooComponent extends Component {
    }

    this.register('component:foo-component', FooComponent);

    this.render(hbs`
      {{foo-component
        ariaRole="button"
        class="bar"
        classNames="bar baz"
        id="foo"
        isVisible=true
        tagName="button"
      }}
    `);
  });
}
