import EmberObject from '@ember/object';
import { test, module } from 'qunit';

import { argument } from '@ember-decorators/argument';

module('@argument');

test('it works', function(assert) {
  class Foo extends EmberObject {
    @argument
    bar = 1;

    baz = 2;
  }

  const foo = Foo.create();
  const fooWithValues = Foo.create({ bar: 3, baz: 4 });

  assert.equal(foo.get('bar'), 1, 'argument default gets set correctly');
  assert.equal(foo.get('baz'), 2, 'class field default gets set correctly');

  assert.equal(fooWithValues.get('bar'), 3, 'argument default can be overriden');
  assert.equal(fooWithValues.get('baz'), 2, 'class field default cannot be overriden');
});

test('it works with the ES class hierarchy', function(assert) {
  class Foo extends EmberObject {
    @argument
    prop = 1;

    @argument
    anotherProp = 2;
  }

  class Bar extends Foo {
    @argument
    prop = 3;

    anotherProp = 4;
  }

  class Baz extends Bar {
    @argument
    anotherProp = 5;
  }

  const bar = Bar.create({});
  const baz = Baz.create({});

  const barWithValues = Bar.create({ prop: 6, anotherProp: 7 });
  const bazWithValues = Baz.create({ prop: 7, anotherProp: 7 });

  assert.equal(bar.get('prop'), 3, 'argument default can be overriden by subclass');
  assert.equal(bar.get('anotherProp'), 4, 'argument can be added to subclass');

  assert.equal(barWithValues.get('prop'), 6, 'subclass argument default can be overriden');
  assert.equal(barWithValues.get('anotherProp'), 4, 'subclass argument default can be overriden');

  assert.equal(baz.get('anotherProp'), 4, 'argument cannot override class field');
  assert.equal(bazWithValues.get('anotherProp'), 4, 'argument passed in cannot override class field');
});

test('it works with the ES class hierarchy up the prototype chain', function(assert) {
  class Foo extends EmberObject {
    @argument
    prop = 1;
  }

  class Bar extends Foo {}

  class Baz extends Bar {}

  class Quix extends Baz {
    @argument
    anotherProp = 2;
  }

  const quix = Quix.create({});
  const quixWithValues = Baz.create({ prop: 7, anotherProp: 7 });

  assert.equal(quix.get('prop'), 1, 'argument default is set');
  assert.equal(quix.get('anotherProp'), 2, 'argument default is set');

  assert.equal(quixWithValues.get('prop'), 7, 'subclass argument default can be overriden');
  assert.equal(quixWithValues.get('prop'), 7, 'subclass argument default can be overriden');
});
