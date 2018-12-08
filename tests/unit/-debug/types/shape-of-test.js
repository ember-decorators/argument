import EmberObject from '@ember/object';
import { test, module } from 'qunit';

import { argument } from '@ember-decorators/argument';
import { type, shapeOf, optional } from '@ember-decorators/argument/type';

module('shapeOf', function() {
  test('it works', function(assert) {
    assert.expect(0);

    class Foo extends EmberObject {
      @type(shapeOf({ foo: 'string' }))
      @argument
      bar;
    }

    Foo.create({ bar: { foo: 'baz' } });
  });

  test('it works with optional', function(assert) {
    assert.expect(0);

    class Foo extends EmberObject {
      @type(optional(shapeOf({ foo: 'string' })))
      @argument
      bar;
    }

    Foo.create({ bar: null });
  });

  test('it throws if array items do not match', function(assert) {
    assert.throws(() => {
      class Foo extends EmberObject {
        @type(shapeOf({ foo: 'string' }))
        @argument
        bar;
      }

      Foo.create({ bar: { qux: 'baz' } });
    }, /Foo#bar expected value of type shapeOf\({foo:string}\) during 'init', but received: \[object Object\]/);
  });

  test('it throws if type does not match', function(assert) {
    assert.throws(() => {
      class Foo extends EmberObject {
        @type(shapeOf({ foo: 'string' }))
        @argument
        bar;
      }

      Foo.create({ bar: 2 });
    }, /Foo#bar expected value of type shapeOf\({foo:string}\) during 'init', but received: 2/);
  });

  test('it throws if non-object passed in', function(assert) {
    assert.throws(() => {
      class Foo extends EmberObject {
        @type(shapeOf(true))
        @argument
        bar;
      }

      Foo.create({ bar: 2 });
    }, /The 'shapeOf' helper must receive an object to match the shape to, received: true/);
  });

  test('it throws if empty object passed in', function(assert) {
    assert.throws(() => {
      class Foo extends EmberObject {
        @type(shapeOf({}))
        @argument
        bar;
      }

      Foo.create({ bar: 2 });
    }, /The object passed to the 'shapeOf' helper must have at least one key:type pair/);
  });

  test('it throws if incorrect number of items passed in', function(assert) {
    assert.throws(() => {
      class Foo extends EmberObject {
        @type(shapeOf())
        @argument
        bar;
      }

      Foo.create({ bar: 2 });
    }, /The 'shapeOf' helper must receive exactly one shape/);

    assert.throws(() => {
      class Foo extends EmberObject {
        @type(shapeOf(1, 2))
        @argument
        bar;
      }

      Foo.create({ bar: 2 });
    }, /The 'shapeOf' helper must receive exactly one shape/);
  });
});
