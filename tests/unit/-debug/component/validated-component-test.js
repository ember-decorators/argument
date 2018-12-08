import Ember from 'ember';
import Component from '@ember/component';

import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { module, test } from 'qunit';

import config from 'ember-get-config';

import { gte } from 'ember-compatibility-helpers';

import { argument } from '@ember-decorators/argument';
import { type } from '@ember-decorators/argument/type';
import { attribute, className } from '@ember-decorators/component';

let originalTestAdapterException;

module('validate component', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    originalTestAdapterException = Ember.Test.adapter.exception;
    Ember.Test.adapter.exception = function(e) {
      throw e;
    };
  });

  hooks.afterEach(function() {
    Ember.Test.adapter.exception = originalTestAdapterException;
  });

  test('asserts on args which are not the correct type', function(assert) {
    class FooComponent extends Component {
      @argument @type('string') foo;
    }

    this.owner.register('component:foo-component', FooComponent);

    assert.throws(async () => {
      await render(hbs`{{foo-component foo=123}}`);
    }, /FooComponent#foo expected value of type string during 'init', but received: 123/);
  });

  if (gte('1.13.0')) {
    test('asserts on args which are not defined', function(assert) {
      class FooComponent extends Component {}

      this.register('component:foo-component', FooComponent);

      assert.throws(() => {
        this.render(hbs`{{foo-component foo=123}}`);
      }, /Attempted to assign the argument 'foo' on an instance of FooComponent/);
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
          this.classNameBindings = ['foo'];
        }
      }

      this.register('component:foo-component', FooComponent);

      this.render(hbs`{{foo-component foo=123 data-test=true}}`);
    });

    test('does not assert on whitelisted arguments and attributes', function(assert) {
      assert.expect(0);

      class FooComponent extends Component {}

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

    test('does not assert on undefined args when there are no validations and `ignoreComponentsWithoutValidations` is enabled', function(assert) {
      assert.expect(0);
      config[
        '@ember-decorators/argument'
      ].ignoreComponentsWithoutValidations = true;

      class FooComponent extends Component {}

      this.register('component:foo-component', FooComponent);

      this.render(hbs`{{foo-component foo=123}}`);

      config[
        '@ember-decorators/argument'
      ].ignoreComponentsWithoutValidations = false;
    });

    test('asserts on args when there are validations and `ignoreComponentsWithoutValidations` is enabled', function(assert) {
      config[
        '@ember-decorators/argument'
      ].ignoreComponentsWithoutValidations = true;

      class FooComponent extends Component {
        @argument foo;
      }

      this.register('component:foo-component', FooComponent);

      assert.throws(() => {
        this.render(hbs`{{foo-component bar=123}}`);
      });

      config[
        '@ember-decorators/argument'
      ].ignoreComponentsWithoutValidations = false;
    });
  }
});
