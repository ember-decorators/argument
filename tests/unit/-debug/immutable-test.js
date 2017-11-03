import EmberObject from '@ember/object';
import { test, module } from 'qunit';

import { argument } from '@ember-decorators/argument';
import { type } from '@ember-decorators/argument/type';
import { immutable } from '@ember-decorators/argument/validation';

module('@immutable');

test('it works', function(assert) {
  class Foo extends EmberObject {
    @immutable
    @argument
    bar;
  }

  const foo = Foo.create({ bar: 'baz' });

  assert.throws(() => {
    foo.set('bar', 123);
  }, /Attempted to set .*#bar to the value 123 but the field is immutable/);
});

test('it cannot be overridden', function(assert) {

  class Foo extends EmberObject {
    @immutable
    @argument
    bar;
  }

  class Bar extends Foo {
    @type('string')
    @argument
    bar;
  }

  const bar = Bar.create({ bar: 'baz' });

  assert.throws(() => {
    bar.set('bar', '123');
  }, /Attempted to set .*#bar to the value 123 but the field is immutable/);
});

test('default value can be overriden', function(assert) {
  class Foo extends EmberObject {
    @immutable
    @argument
    bar;
  }

  class Bar extends Foo {
    bar = 123;
  }

  const bar = Bar.create();

  assert.equal(bar.get('bar'), 123, 'default value provided');

  assert.throws(() => {
    bar.set('bar', '123');
  }, /Attempted to set .*#bar to the value 123 but the field is immutable/);
});

test('subclass can make field immutable', function(assert) {
  class Foo extends EmberObject {
    @type('number')
    bar = 123;
  }

  class Bar extends Foo {
    @immutable
    bar;
  }

  const bar = Bar.create();

  assert.equal(bar.get('bar'), 123, 'default value provided');

  assert.throws(() => {
    bar.set('bar', '123');
  }, /Attempted to set .*#bar to the value 123 but the field is immutable/);
});
