import { test, module } from 'qunit';
import EmberObject from '@ember/object';

import { argument } from '@ember-decorators/argument';
import { unionOf } from '@ember-decorators/argument/types';

module('Unit | types | unionOf', function() {
  test('it works', function(assert) {
    assert.expect(0);

    class Foo extends EmberObject {
      @argument(unionOf('string', 'undefined', Date))
      bar;
    }

    Foo.create({ bar: 'baz' });
    Foo.create({ bar: new Date() });
    Foo.create({});
  });

  test('it throws if type does not match', function(assert) {
    class Foo extends EmberObject {
      @argument(unionOf('string', 'undefined'))
      bar;
    }

    assert.throws(() => {
      Foo.create({ bar: null });
    }, /Foo#bar expected value of type unionOf\(string,undefined\) during 'init', but received: null/);

    assert.throws(() => {
      Foo.create({ bar: new Date() });
    }, /Foo#bar expected value of type unionOf\(string,undefined\) during 'init', but received/);
  });

  test('it requires primitive types or classes', function(assert) {
    assert.throws(() => {
      class Foo extends EmberObject {
        @argument(unionOf('string', 'aoeu'))
        bar;
      }

      Foo.create({ bar: 2 });
    }, /Unknown primitive type received: aoeu/);

    assert.throws(() => {
      class Foo extends EmberObject {
        @argument(unionOf('string', 2))
        bar;
      }

      Foo.create({ bar: 2 });
    }, /Types must either be a primitive type string, class, validator, or null or undefined, received: 2/);

    assert.throws(() => {
      class Foo extends EmberObject {
        @argument(unionOf('string', true))
        bar;
      }

      Foo.create({ bar: 2 });
    }, /Types must either be a primitive type string, class, validator, or null or undefined, received: true/);
  });

  test('it throws if incorrect number of items passed in', function(assert) {
    assert.throws(() => {
      class Foo extends EmberObject {
        @argument(unionOf())
        bar;
      }

      Foo.create({ bar: 2 });
    }, /The 'unionOf' helper must receive more than one type/);

    assert.throws(() => {
      class Foo extends EmberObject {
        @argument(unionOf('string'))
        bar;
      }

      Foo.create({ bar: 2 });
    }, /The 'unionOf' helper must receive more than one type/);
  });
});
