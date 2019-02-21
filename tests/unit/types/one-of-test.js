import { test, module } from 'qunit';
import EmberObject from '@ember/object';

import { argument } from '@ember-decorators/argument';
import { oneOf } from '@ember-decorators/argument/types';

module('Unit | types | oneOf', function() {
  test('it works', function(assert) {
    assert.expect(0);

    class Foo extends EmberObject {
      @argument(oneOf('red', 'blue', 'green'))
      bar;
    }

    Foo.create({ bar: 'blue' });
  });

  test('it throws if arguments do not match', function(assert) {
    assert.throws(() => {
      class Foo extends EmberObject {
        @argument(oneOf('red', 'blue', 'green'))
        bar;
      }

      Foo.create({ bar: 'magenta' });
    }, /Foo#bar expected value of type oneOf\(red,blue,green\) during 'set', but received: 'magenta'/);
  });

  test('it throws if non-string passed in', function(assert) {
    assert.throws(() => {
      class Foo extends EmberObject {
        @argument(oneOf(true))
        bar;
      }

      Foo.create({ bar: 'peanut butter' });
    }, /The 'oneOf' helper must receive arguments of strings, received: true/);
  });

  test('it throws if incorrect number of items passed in', function(assert) {
    assert.throws(() => {
      class Foo extends EmberObject {
        @argument(oneOf())
        bar;
      }

      Foo.create({ bar: 'grapes' });
    }, /The 'oneOf' helper must receive at least one argument/);
  });
});
