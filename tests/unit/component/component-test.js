import Component from '@ember/component';
import { addObserver } from '@ember/object/observers';

import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent } from 'ember-qunit';
import { test } from 'qunit';

import { gte } from 'ember-compatibility-helpers';

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

test('argument works with bindings', function(assert) {
  assert.expect(1);

  let calls = [];

  class FooComponent extends Component {
    @argument foo = true;

    didInsertElement() {
      addObserver(this, 'foo', () => {
        calls.push(this.get('foo'));
      });
    }
  }

  this.register('component:foo-component', FooComponent);

  this.render(hbs`{{foo-component foo=bar}}`);

  this.set('bar', false);
  this.set('bar', true);
  this.set('bar', false);
  this.set('bar', false);
  this.set('bar', true);
  this.set('bar', 123);
  this.set('bar', 123);

  assert.deepEqual(calls, [false, true, false, true, 123], 'binding updated correctly');
});

test('argument defaultIfUndefined works with bindings', function(assert) {
  assert.expect(1);

  let vals = [];

  class FooComponent extends Component {
    @argument({ defaultIfUndefined: true })
    foo = true;

    didInsertElement() {
      vals.push(this.get('foo'));

      addObserver(this, 'foo', () => vals.push(this.get('foo')));
    }
  }

  this.set('foo', undefined);

  this.register('component:foo-component', FooComponent);

  this.render(hbs`{{foo-component foo=foo}}`);

  this.set('foo', 123);
  this.set('foo', undefined);

  assert.deepEqual(vals, [true, 123, true]);
});

test('argument defaultIfNullish works with bindings', function(assert) {
  assert.expect(1);

  let vals = [];

  class FooComponent extends Component {
    @argument({ defaultIfNullish: true })
    foo = true;

    @argument({ defaultIfNullish: true })
    bar = true;

    didInsertElement() {
      vals.push(this.get('foo'));

      addObserver(this, 'foo', () => vals.push(this.get('foo')));
    }
  }

  this.set('foo', undefined);

  this.register('component:foo-component', FooComponent);

  this.render(hbs`{{foo-component foo=foo}}`);

  this.set('foo', 123);
  this.set('foo', null);

  assert.deepEqual(vals, [true, 123, true]);
});

if (gte('3.1.0')) {
  test('named argument default values ({{@foo}} syntax)', function(assert) {
    class FooComponent extends Component {
      @argument foo = 123;
    }

    this.register('component:foo-component', FooComponent);
    this.register('template:components/foo-component', hbs`{{@foo}}`);

    this.render(hbs`{{foo-component id="bar"}}`);

    assert.equal(find('#bar').textContent, '123');
  });
}
