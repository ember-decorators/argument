import EmberObject from '@ember/object';
import { test, module } from 'qunit';

import { argument, type } from 'ember-argument-decorators';
import { unionOf } from 'ember-argument-decorators/types';

module('unionOf');

test('it works', function(assert) {
  assert.expect(0);

  class Foo extends EmberObject {
    @type(unionOf('string', 'undefined', Date))
    @argument
    bar;
  }

  Foo.create({ bar: 'baz' });
  Foo.create({ bar: new Date() });
  Foo.create({});
});

test('it throws if type does not match', function(assert) {
  class Foo extends EmberObject {
    @type(unionOf('string', 'undefined'))
    @argument
    bar;
  }

  assert.throws(() => {
    Foo.create({ bar: null });
  }, /bar expected value of type unionOf\(string,undefined\), but received: null/);

  assert.throws(() => {
    Foo.create({ bar: new Date() });
  }, /bar expected value of type unionOf\(string,undefined\), but received/);
});

test('it requires primitive types or classes', function(assert) {
  assert.throws(() => {
    class Foo extends EmberObject {
      @type(unionOf('string','aoeu'))
      @argument
      bar;
    }

    Foo.create({ bar: 2 });
  }, /Unknown primitive type received: aoeu/);

  assert.throws(() => {
    class Foo extends EmberObject {
      @type(unionOf('string', 2))
      @argument
      bar;
    }

    Foo.create({ bar: 2 });
  }, /Types must either be a primitive type string, a class, or a validator, received: 2/);

  assert.throws(() => {
    class Foo extends EmberObject {
      @type(unionOf('string', true))
      @argument
      bar;
    }

    Foo.create({ bar: 2 });
  }, /Types must either be a primitive type string, a class, or a validator, received: true/);

  assert.throws(() => {
    class Foo extends EmberObject {
      @type(unionOf('string', {}))
      @argument
      bar;
    }

    Foo.create({ bar: 2 });
  }, /Types must either be a primitive type string, a class, or a validator, received: \[object Object\]/);

  assert.throws(() => {
    class Foo extends EmberObject {
      @type(unionOf('string', []))
      @argument
      bar;
    }

    Foo.create({ bar: 2 });
  }, /Types must either be a primitive type string, a class, or a validator, received:/);
});

test('it throws if incorrect number of items passed in', function(assert) {
  assert.throws(() => {
    class Foo extends EmberObject {
      @type(unionOf())
      @argument
      bar;
    }

    Foo.create({ bar: 2 });
  }, /The 'unionOf' helper must receive more than one type/);

  assert.throws(() => {
    class Foo extends EmberObject {
      @type(unionOf('string'))
      @argument
      bar;
    }

    Foo.create({ bar: 2 });
  }, /The 'unionOf' helper must receive more than one type/);
});
