import Component from '@ember/component';
import { addObserver } from '@ember/object/observers';

import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { module, test } from 'qunit';

import { argument } from '@ember-decorators/argument';
import { type } from '@ember-decorators/argument/type';

import { find } from 'ember-native-dom-helpers';

module('component', function(hooks) {
  setupRenderingTest(hooks);

  test('argument sets default value correctly', async function(assert) {
    class FooComponent extends Component {
      @argument foo = 123;
    }

    this.owner.register('component:foo-component', FooComponent);
    this.owner.register('template:components/foo-component', hbs`{{foo}}`);

    await render(hbs`{{foo-component id="bar"}}`);

    assert.equal(find('#bar').textContent, '123');
  });

  test('argument value can be overriden', async function(assert) {
    class FooComponent extends Component {
      @argument foo = 123;
    }

    this.owner.register('component:foo-component', FooComponent);
    this.owner.register('template:components/foo-component', hbs`{{foo}}`);

    await render(hbs`{{foo-component id="bar" foo=456}}`);

    assert.equal(find('#bar').textContent, '456');
  });

  test('argument value can be overridden in subclass', async function(assert) {
    class FooComponent extends Component {
      @argument foo = 123;
    }

    class BarComponent extends Component {
      @type('number')
      @argument
      bar = 456;
    }

    this.owner.register('component:foo-component', FooComponent);
    this.owner.register(
      'template:components/foo-component',
      hbs`{{bar-component bar=foo}}`
    );

    this.owner.register('component:bar-component', BarComponent);
    this.owner.register('template:components/bar-component', hbs`{{bar}}`);

    await render(hbs`{{foo-component id="bar"}}`);

    assert.equal(find('#bar').textContent, '123');
  });

  test('argument works with bindings', async function(assert) {
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

    this.owner.register('component:foo-component', FooComponent);

    await render(hbs`{{foo-component foo=bar}}`);

    this.set('bar', false);
    this.set('bar', true);
    this.set('bar', false);
    this.set('bar', false);
    this.set('bar', true);
    this.set('bar', 123);
    this.set('bar', 123);

    assert.deepEqual(
      calls,
      [false, true, false, true, 123],
      'binding updated correctly'
    );
  });

  test('argument defaultIfUndefined works with bindings', async function(assert) {
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

    this.owner.register('component:foo-component', FooComponent);

    await render(hbs`{{foo-component foo=foo}}`);

    this.set('foo', 123);
    this.set('foo', undefined);

    assert.deepEqual(vals, [true, 123, true]);
  });

  test('argument defaultIfNullish works with bindings', async function(assert) {
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

    this.owner.register('component:foo-component', FooComponent);

    await render(hbs`{{foo-component foo=foo}}`);

    this.set('foo', 123);
    this.set('foo', null);

    assert.deepEqual(vals, [true, 123, true]);
  });
});
