import EmberObject from '@ember/object';
import { test, module } from 'qunit';

import { gte } from 'ember-compatibility-helpers';

import { argument } from '@ember-decorators/argument';

module('@argument', function() {
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

    assert.equal(
      fooWithValues.get('bar'),
      3,
      'argument default can be overriden'
    );
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

    const bar = Bar.create({});
    const barWithValues = Bar.create({ prop: 6 });

    assert.equal(
      bar.get('prop'),
      3,
      'argument default can be overriden by subclass'
    );
    assert.equal(
      bar.get('anotherProp'),
      4,
      'argument can be added to subclass'
    );

    assert.equal(
      barWithValues.get('prop'),
      6,
      'subclass argument default can be overriden'
    );
    assert.equal(
      barWithValues.get('anotherProp'),
      4,
      'subclass argument default can be overriden'
    );
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

    assert.equal(
      quixWithValues.get('prop'),
      7,
      'subclass argument default can be overriden'
    );
    assert.equal(
      quixWithValues.get('prop'),
      7,
      'subclass argument default can be overriden'
    );
  });

  test('it works with defaultIfUndefined', function(assert) {
    class Foo extends EmberObject {
      @argument({ defaultIfUndefined: true })
      bar = 1;
    }

    const foo = Foo.create({ bar: undefined });
    const fooWithValues = Foo.create({ bar: 3 });

    assert.equal(foo.get('bar'), 1, 'argument default gets set correctly');
    assert.equal(
      fooWithValues.get('bar'),
      3,
      'argument default can be overriden'
    );

    foo.set('bar', undefined);
    assert.equal(
      foo.get('bar'),
      1,
      'argument cannot be set to undefined in repeated usage'
    );
  });

  test('it works with defaultIfNullish', function(assert) {
    class Foo extends EmberObject {
      @argument({ defaultIfNullish: true })
      bar = 1;
    }

    const fooWithUndefined = Foo.create({ bar: undefined });
    const fooWithNull = Foo.create({ bar: null });
    const fooWithValues = Foo.create({ bar: 3 });

    assert.equal(
      fooWithUndefined.get('bar'),
      1,
      'argument default gets set correctly'
    );
    assert.equal(
      fooWithNull.get('bar'),
      1,
      'argument default gets set correctly'
    );
    assert.equal(
      fooWithValues.get('bar'),
      3,
      'argument default can be overriden'
    );

    fooWithUndefined.set('bar', null);
    fooWithNull.set('bar', undefined);
    assert.equal(
      fooWithUndefined.get('bar'),
      1,
      'argument cannot be set to null in repeated usage'
    );
    assert.equal(
      fooWithNull.get('bar'),
      1,
      'argument cannot be set to undefined in repeated usage'
    );
  });

  test('it works if no default value was given', function(assert) {
    class Foo extends EmberObject {
      @argument
      bar;
    }

    const foo = Foo.create();
    const fooWithValues = Foo.create({ bar: 3 });

    assert.equal(
      foo.get('bar'),
      undefined,
      'argument default gets set correctly'
    );
    assert.equal(
      fooWithValues.get('bar'),
      3,
      'argument default can be overriden'
    );
  });

  if (gte('3.1.0')) {
    test('works with native getters', function(assert) {
      class Foo extends EmberObject {
        @argument
        bar = 1;

        baz = 2;
      }

      const foo = Foo.create();
      const fooWithValues = Foo.create({ bar: 3, baz: 4 });

      assert.equal(foo.bar, 1, 'argument default gets set correctly');
      assert.equal(foo.baz, 2, 'class field default gets set correctly');

      assert.equal(fooWithValues.bar, 3, 'argument default can be overriden');
    });

    test('it works with defaultIfUndefined and native getters', function(assert) {
      class Foo extends EmberObject {
        @argument({ defaultIfUndefined: true })
        bar = 1;
      }

      const foo = Foo.create({ bar: undefined });
      const fooWithValues = Foo.create({ bar: 3 });

      assert.equal(foo.bar, 1, 'argument default gets set correctly');
      assert.equal(fooWithValues.bar, 3, 'argument default can be overriden');

      foo.set('bar', undefined);
      assert.equal(
        foo.bar,
        1,
        'argument cannot be set to undefined in repeated usage'
      );
    });

    test('it works with defaultIfNullish and native getters', function(assert) {
      class Foo extends EmberObject {
        @argument({ defaultIfNullish: true })
        bar = 1;
      }

      const fooWithUndefined = Foo.create({ bar: undefined });
      const fooWithNull = Foo.create({ bar: null });
      const fooWithValues = Foo.create({ bar: 3 });

      assert.equal(
        fooWithUndefined.bar,
        1,
        'argument default gets set correctly'
      );
      assert.equal(fooWithNull.bar, 1, 'argument default gets set correctly');
      assert.equal(fooWithValues.bar, 3, 'argument default can be overriden');

      fooWithUndefined.set('bar', null);
      fooWithNull.set('bar', undefined);
      assert.equal(
        fooWithUndefined.bar,
        1,
        'argument cannot be set to null in repeated usage'
      );
      assert.equal(
        fooWithNull.bar,
        1,
        'argument cannot be set to undefined in repeated usage'
      );
    });
  }
});
