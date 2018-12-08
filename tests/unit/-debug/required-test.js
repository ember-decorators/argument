import EmberObject from '@ember/object';
import { test, module } from 'qunit';

import { gte } from 'ember-compatibility-helpers';

import { computed } from '@ember-decorators/object';
import { argument } from '@ember-decorators/argument';
import { required } from '@ember-decorators/argument/validation';

module('@required');

test('it works', function(assert) {
  assert.expect(1);

  class Foo extends EmberObject {
    @required
    @argument
    prop;
  }

  Foo.create({ prop: 123 });

  assert.throws(() => {
    Foo.create();
  }, /Foo#prop is a required value, but was not provided/);
});

test('it works with subclasses', function(assert) {
  assert.expect(1);

  class Foo extends EmberObject {
    @required
    @argument
    prop;
  }

  class Bar extends Foo {}

  Bar.create({ prop: 123 });

  assert.throws(() => {
    Bar.create();
  }, /Bar#prop is a required value, but was not provided/);
});

test('required argument can be provided by subclass', function(assert) {
  assert.expect(1);

  class Foo extends EmberObject {
    @required
    @argument
    prop;
  }

  class Bar extends Foo {
    prop = 1;
  }

  const bar = Bar.create();

  assert.equal(bar.get('prop'), 1);
});

test('required argument can be provided by subclass via getter', function(assert) {
  assert.expect(1);

  class Foo extends EmberObject {
    @required
    @argument
    prop;
  }

  class Bar extends Foo {
    get prop() {
      return 1;
    }
  }

  const bar = Bar.create();

  assert.equal(bar.get('prop'), 1);
});

test('required argument can be provided by subclass via computed', function(assert) {
  assert.expect(1);

  class Foo extends EmberObject {
    @required
    @argument
    prop;
  }

  class Bar extends Foo {
    @computed
    get prop() {
      return 1;
    }
  }

  const bar = Bar.create();

  assert.equal(bar.get('prop'), 1);
});

test('subclass can make a field required', function(assert) {
  assert.expect(1);

  class Foo extends EmberObject {
    @argument
    prop;
  }

  class Bar extends Foo {
    @required
    prop;
  }

  Foo.create(); // Does not affect superclass

  Bar.create({ prop: 123 });

  assert.throws(() => {
    Bar.create();
  }, /Bar#prop is a required value, but was not provided/);
});

if (gte('3.1.0')) {
  test('works with native getters', function(assert) {
    class Foo extends EmberObject {
      @required
      @argument
      prop;
    }

    let foo = Foo.create({ prop: 123 });

    assert.equal(foo.prop, 123, 'can get value');

    assert.throws(() => {
      Foo.create();
    }, /Foo#prop is a required value, but was not provided/);
  });
}
