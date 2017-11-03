import EmberObject from '@ember/object';
import { test, module } from 'qunit';

import { argument } from '@ember-decorators/argument';
import { type, subclassOf } from '@ember-decorators/argument/type';

module('subclassOf');

test('it works', function(assert) {
  assert.expect(0);

  class Bar extends EmberObject {}

  class Baz extends Bar {}

  class Foo extends EmberObject {
    @type(subclassOf(Bar))
    @argument
    bar;
  }

  Foo.create({ bar: Baz.create() });
});

test('it with Ember objects', function(assert) {
  assert.expect(0);

  const Bar = EmberObject.extend();

  const Baz = Bar.extend();

  class Foo extends EmberObject {
    @type(subclassOf(EmberObject))
    @argument
    bar;

    @type(subclassOf(Bar))
    @argument
    baz;
  }

  Foo.create({ bar: Bar.create(), baz: Baz.create() });
});

test('it with standard classes', function(assert) {
  assert.expect(0);

  class Bar {}

  class Baz extends Bar {}

  class Foo extends EmberObject {
    @type(subclassOf(Bar))
    @argument
    bar;
  }

  Foo.create({ bar: new Baz() });
});

test('it throws if type does not match', function(assert) {
  class Foo extends EmberObject {
    @type(subclassOf(EmberObject))
    @argument
    bar;
  }

  assert.throws(() => {
    Foo.create({ bar: null });
  }, /bar expected value of type subclassOf\(Ember.Object\), but received: null/);

  assert.throws(() => {
    Foo.create({ bar: EmberObject.create() });
  }, /bar expected value of type subclassOf\(Ember.Object\), but received:/);
});

test('it requires a class function', function(assert) {
  assert.throws(() => {
    class Foo extends EmberObject {
      @type(subclassOf('string'))
      @argument
      bar;
    }

    Foo.create({ bar: 2 });
  }, /The 'subclassOf' helper must receive a class constructor, received: string/);

  assert.throws(() => {
    class Foo extends EmberObject {
      @type(subclassOf({}))
      @argument
      bar;
    }

    Foo.create({ bar: 2 });
  }, /The 'subclassOf' helper must receive a class constructor, received: \[object Object\]/);
});

test('it throws if incorrect number of items passed in', function(assert) {
  assert.throws(() => {
    class Foo extends EmberObject {
      @type(subclassOf())
      @argument
      bar;
    }

    Foo.create({ bar: 2 });
  }, /The 'subclassOf' helper must receive exactly one class/);

  assert.throws(() => {
    class Foo extends EmberObject {
      @type(subclassOf('string', 'bar'))
      @argument
      bar;
    }

    Foo.create({ bar: 2 });
  }, /The 'subclassOf' helper must receive exactly one class/);
});
