import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import Component from '@ember/component';

import { argument } from '@ember-decorators/argument';
import { optional } from '@ember-decorators/argument/types';
import { attribute, className } from '@ember-decorators/component';

import waitForError from '../helpers/wait-for-error';

class ComponentWithArgument extends Component {
  @argument(optional('string')) someProp;
}

module('Integration | Component Behavior', function(hooks) {
  setupRenderingTest(hooks);

  test('asserts on args which are not the correct type', async function(assert) {
    class FooComponent extends ComponentWithArgument {
      @argument('string') foo;
    }

    this.owner.register('component:foo-component', FooComponent);

    const [error] = await Promise.all([
      waitForError(),
      render(hbs`{{foo-component foo=123}}`)
    ]);

    assert.equal(
      error.message,
      "FooComponent#foo expected value of type string during 'init', but received: 123"
    );
  });

  test('asserts on args which are not defined', async function(assert) {
    class FooComponent extends ComponentWithArgument {
      @argument('number') foo;
    }

    this.owner.register('component:foo-component', FooComponent);

    const [error] = await Promise.all([
      waitForError(),
      render(hbs`{{foo-component foo=123 bar='should error'}}`)
    ]);

    assert.equal(
      error.message,
      "Assertion Failed: Attempted to assign the argument 'bar' on an instance of FooComponent, but no argument was defined for that key. Use the @argument helper on the class field to define an argument for that class."
    );
  });

  test('does not assert on args which are defined', async function(assert) {
    assert.expect(0);

    class FooComponent extends ComponentWithArgument {
      @argument('number') foo;
    }

    this.owner.register('component:foo-component', FooComponent);

    await render(hbs`{{foo-component foo=123}}`);
  });

  test('does not assert on attributes which are defined', async function(assert) {
    assert.expect(0);

    class FooComponent extends ComponentWithArgument {
      @attribute foo;
    }

    this.owner.register('component:foo-component', FooComponent);

    await render(hbs`{{foo-component foo=123}}`);
  });

  test('does not assert on classNames which are defined', async function(assert) {
    assert.expect(0);

    class FooComponent extends ComponentWithArgument {
      @className foo;
    }

    this.owner.register('component:foo-component', FooComponent);

    await render(hbs`{{foo-component foo=123}}`);
  });

  test('does not assert on classNames or attributes which are defined dynamically', async function(assert) {
    assert.expect(0);

    class FooComponent extends ComponentWithArgument {
      constructor() {
        super(...arguments);

        this.attributeBindings = ['data-test'];
        this.classNameBindings = ['foo'];
      }
    }

    this.owner.register('component:foo-component', FooComponent);

    await render(hbs`{{foo-component foo=123 data-test=true}}`);
  });

  test('does not assert on whitelisted arguments and attributes', async function(assert) {
    assert.expect(0);

    class FooComponent extends ComponentWithArgument {}

    this.owner.register('component:foo-component', FooComponent);

    await render(hbs`
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

  test('does not assert on attributes added to the whitelist', async function(assert) {
    assert.expect(0);

    class FooComponent extends ComponentWithArgument {}

    this.owner.register('component:foo-component', FooComponent);

    await render(hbs`
      {{foo-component
        exact-attribute='something'
        hotReloadCUSTOMName='something'
      }}
    `);
  });
});
