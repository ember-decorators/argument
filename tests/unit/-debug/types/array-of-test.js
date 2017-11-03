import EmberObject from '@ember/object';
import { test, module } from 'qunit';

import { argument } from '@ember-decorators/argument';
import { type, arrayOf } from '@ember-decorators/argument/type';

module('arrayOf');

test('it works', function(assert) {
  assert.expect(0);

  class Foo extends EmberObject {
    @type(arrayOf('string'))
    @argument
    bar;
  }

  Foo.create({ bar: ['baz'] });
});

test('it throws if array items do not match', function(assert) {
  assert.throws(() => {
    class Foo extends EmberObject {
      @type(arrayOf('string'))
      @argument
      bar;
    }

    Foo.create({ bar: ['baz', 2] });
  }, /bar expected value of type arrayOf\(string\), but received: baz,2/);
});

test('it throws if type does not match', function(assert) {
  assert.throws(() => {
    class Foo extends EmberObject {
      @type(arrayOf('string'))
      @argument
      bar;
    }

    Foo.create({ bar: 2 });
  }, /bar expected value of type arrayOf\(string\), but received: 2/);
});

test('it throws if incorrect number of items passed in', function(assert) {
  assert.throws(() => {
    class Foo extends EmberObject {
      @type(arrayOf())
      @argument
      bar;
    }

    Foo.create({ bar: 2 });
  }, /The 'arrayOf' helper must receive exactly one type. Use the 'unionOf' helper to create a union type./);

  assert.throws(() => {
    class Foo extends EmberObject {
      @type(arrayOf(1, 2))
      @argument
      bar;
    }

    Foo.create({ bar: 2 });
  }, /The 'arrayOf' helper must receive exactly one type. Use the 'unionOf' helper to create a union type./);
});
