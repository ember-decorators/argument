import EmberObject from '@ember/object';
import { test, module } from 'qunit';

import { argument, required } from '@ember-decorators/argument';

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
  }, /requires a 'prop' argument to be passed in when using the component/);
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
  }, /requires a 'prop' argument to be passed in when using the component/);
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
  }, /requires a 'prop' argument to be passed in when using the component/);
});
