import Component from '@ember/component';

import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent } from 'ember-qunit';
import { test } from 'qunit';

import { argument } from '@ember-decorators/argument';
import { type } from '@ember-decorators/argument/type';

import { find } from 'ember-native-dom-helpers';

moduleForComponent('component', { integration: true });

test('argument sets default value correctly', function(assert) {
  class FooComponent extends Component {
    @argument foo = 123;
  }

  this.register('component:foo-component', FooComponent);
  this.register('template:components/foo-component', hbs`{{foo}}`);

  this.render(hbs`{{foo-component id="bar"}}`);

  assert.equal(find('#bar').textContent, '123');
});

test('argument value can be overriden', function(assert) {
  class FooComponent extends Component {
    @argument foo = 123;
  }

  this.register('component:foo-component', FooComponent);
  this.register('template:components/foo-component', hbs`{{foo}}`);

  this.render(hbs`{{foo-component id="bar" foo=456}}`);

  assert.equal(find('#bar').textContent, '456');
});

test('argument value can be overridden in subclass', function(assert) {
  class FooComponent extends Component {
    @argument foo = 123;
  }

  class BarComponent extends Component {
    @type('number')
    @argument bar = 456;
  }

  this.register('component:foo-component', FooComponent);
  this.register('template:components/foo-component', hbs`{{bar-component bar=foo}}`);

  this.register('component:bar-component', BarComponent);
  this.register('template:components/bar-component', hbs`{{bar}}`);

  this.render(hbs`{{foo-component id="bar"}}`);

  assert.equal(find('#bar').textContent, '123');
});
