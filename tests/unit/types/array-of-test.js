import { test, module } from 'qunit';
import EmberObject from '@ember/object';

import { argument } from '@ember-decorators/argument';
import { arrayOf } from '@ember-decorators/argument/types';

module('Unit | types | arrayOf', function() {
  test('it works', function(assert) {
    assert.expect(0);

    class Foo extends EmberObject {
      @argument(arrayOf('string')) bar;
    }

    Foo.create({ bar: ['baz'] });
  });

  test('it throws if array items do not match', function(assert) {
    assert.throws(() => {
      class Foo extends EmberObject {
        @argument(arrayOf('string')) bar;
      }

      Foo.create({ bar: ['baz', 2] });
    }, /Foo#bar expected value of type arrayOf\(string\) during 'init', but received: baz,2/);
  });

  test('it throws if type does not match', function(assert) {
    assert.throws(() => {
      class Foo extends EmberObject {
        @argument(arrayOf('string')) bar;
      }

      Foo.create({ bar: 2 });
    }, /Foo#bar expected value of type arrayOf\(string\) during 'init', but received: 2/);
  });

  test('it throws if incorrect number of items passed in', function(assert) {
    assert.throws(() => {
      class Foo extends EmberObject {
        @argument(arrayOf()) bar;
      }

      Foo.create({ bar: 2 });
    }, /The 'arrayOf' helper must receive exactly one type. Use the 'unionOf' helper to create a union type./);

    assert.throws(() => {
      class Foo extends EmberObject {
        @argument(arrayOf(1, 2)) bar;
      }

      Foo.create({ bar: 2 });
    }, /The 'arrayOf' helper must receive exactly one type. Use the 'unionOf' helper to create a union type./);
  });
});
