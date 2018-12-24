import { test, module } from 'qunit';
import EmberObject from '@ember/object';

import { argument } from '@ember-decorators/argument';
import { arrayOf } from '@ember-decorators/argument/types';

class Thing {}
class OtherThing {}

module('Unit | types | constructor', function() {
  test('mathing against a class instance', function(assert) {
    class Foo extends EmberObject {
      @argument(Thing) bar;
    }

    Foo.create({ bar: new Thing() });

    assert.throws(function() {
      Foo.create({ bar: new OtherThing() });
    }, /Foo#bar expected value of type `Thing` during 'set', but received: an instance of `OtherThing`/);
  });

  test('matching against a built-in constructor', function(assert) {
    class Foo extends EmberObject {
      @argument(Boolean) bar;
    }

    Foo.create({ bar: new Boolean(false) });

    assert.throws(function() {
      Foo.create({ bar: 'test' });
    }, /Foo#bar expected value of type `Boolean` during 'set', but received: 'test'/);
  });

  test('working with helpers', function(assert) {
    class Foo extends EmberObject {
      @argument(arrayOf(Thing)) bar;
    }

    Foo.create({ bar: [new Thing()] });

    assert.throws(function() {
      Foo.create({ bar: new Thing() });
    }, "Foo#bar expected value of type arrayOf(`Thing`) during 'init', but received: an instance of `Thing`");

    assert.throws(function() {
      Foo.create({ bar: [new OtherThing()] });
    }, "Foo#bar expected value of type arrayOf(`Thing`) during 'init', but received: [an instance of `OtherThing`]");
  });
});
