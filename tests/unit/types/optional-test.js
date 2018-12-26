/* eslint-disable no-unused-vars */

import { test, module } from 'qunit';
import EmberObject from '@ember/object';

import { argument } from '@ember-decorators/argument';
import { optional } from '@ember-decorators/argument/types';

module('Unit | types | optional', function() {
  test('it works', function(assert) {
    assert.expect(0);

    class Foo extends EmberObject {
      @argument(optional('string'))
      bar;
    }

    Foo.create({ bar: 'baz' });
    Foo.create({ bar: null });
    Foo.create({ bar: undefined });
    Foo.create({});
  });

  test('it throws if type does not match', function(assert) {
    class Foo extends EmberObject {
      @argument(optional('string'))
      bar;
    }

    assert.throws(() => {
      Foo.create({ bar: 2 });
    }, /Foo#bar expected value of type optional\(string\) during 'init', but received: 2/);

    assert.throws(() => {
      Foo.create({ bar: new Date() });
    }, /Foo#bar expected value of type optional\(string\) during 'init', but received/);
  });

  test('it requires primitive types or classes', function(assert) {
    assert.throws(() => {
      class Foo extends EmberObject {
        @argument(optional('aoeu'))
        bar;
      }

      Foo.create({ bar: 2 });
    }, /Unknown primitive type received: aoeu/);

    assert.throws(() => {
      class Foo extends EmberObject {
        @argument(optional(2))
        bar;
      }

      Foo.create({ bar: 2 });
    }, /Types must either be a primitive type string, class, validator, or null or undefined, received: 2/);

    assert.throws(() => {
      class Foo extends EmberObject {
        @argument(optional(true))
        bar;
      }

      Foo.create({ bar: 2 });
    }, /Types must either be a primitive type string, class, validator, or null or undefined, received: true/);
  });

  test('it throws if incorrect number of items passed in', function(assert) {
    assert.throws(() => {
      class Foo extends EmberObject {
        @argument(optional())
        bar;
      }

      Foo.create({ bar: 2 });
    }, /The 'optional' helper must receive exactly one type/);

    assert.throws(() => {
      class Foo extends EmberObject {
        @argument(optional('string', 'number'))
        bar;
      }

      Foo.create({ bar: 2 });
    }, /The 'optional' helper must receive exactly one type/);
  });

  test('it throws if null or undefined are passed in', function(assert) {
    assert.throws(() => {
      class Foo extends EmberObject {
        @argument(optional(null))
        bar;
      }
    }, /Passsing 'null' to the 'optional' helper does not make sense./);

    assert.throws(() => {
      class Foo extends EmberObject {
        @argument(optional(undefined))
        bar;
      }
    }, /Passsing 'undefined' to the 'optional' helper does not make sense./);
  });
});
