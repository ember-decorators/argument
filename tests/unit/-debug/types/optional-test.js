import EmberObject from '@ember/object';
import { test, module } from 'qunit';

import { argument } from '@ember-decorators/argument';
import { type, optional } from '@ember-decorators/argument/type';

module('optional');

test('it works', function(assert) {
  assert.expect(0);

  class Foo extends EmberObject {
    @type(optional('string'))
    @argument
    bar;
  }

  Foo.create({ bar: 'baz' });
  Foo.create({ bar: null });
  Foo.create({ bar: undefined });
  Foo.create({});
});

test('it throws if type does not match', function(assert) {
  class Foo extends EmberObject {
    @type(optional('string'))
    @argument
    bar;
  }

  assert.throws(() => {
    Foo.create({ bar: 2 });
  }, /bar expected value of type optional\(string\), but received: 2/);

  assert.throws(() => {
    Foo.create({ bar: new Date() });
  }, /bar expected value of type optional\(string\), but received/);
});

test('it requires primitive types or classes', function(assert) {
  assert.throws(() => {
    class Foo extends EmberObject {
      @type(optional('aoeu'))
      @argument
      bar;
    }

    Foo.create({ bar: 2 });
  }, /Unknown primitive type received: aoeu/);

  assert.throws(() => {
    class Foo extends EmberObject {
      @type(optional(2))
      @argument
      bar;
    }

    Foo.create({ bar: 2 });
  }, /Types must either be a primitive type string, class, validator, or null or undefined, received: 2/);

  assert.throws(() => {
    class Foo extends EmberObject {
      @type(optional(true))
      @argument
      bar;
    }

    Foo.create({ bar: 2 });
  }, /Types must either be a primitive type string, class, validator, or null or undefined, received: true/);
});

test('it throws if incorrect number of items passed in', function(assert) {
  assert.throws(() => {
    class Foo extends EmberObject {
      @type(optional())
      @argument
      bar;
    }

    Foo.create({ bar: 2 });
  }, /The 'optional' helper must receive exactly one type/);

  assert.throws(() => {
    class Foo extends EmberObject {
      @type(optional('string', 'number'))
      @argument
      bar;
    }

    Foo.create({ bar: 2 });
  }, /The 'optional' helper must receive exactly one type/);
});

test('it throws if null or undefined are passed in', function(assert) {
  assert.throws(() => {
    class Foo extends EmberObject {
      @type(optional(null))
      @argument
      bar;
    }

    Foo.create({ bar: 2 });
  }, /Passsing 'null' to the 'optional' helper does not make sense./);

  assert.throws(() => {
    class Foo extends EmberObject {
      @type(optional(undefined))
      @argument
      bar;
    }

    Foo.create({ bar: 2 });
  }, /Passsing 'undefined' to the 'optional' helper does not make sense./);
});
