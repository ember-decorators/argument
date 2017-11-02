import EmberObject from '@ember/object';
import { test, module } from 'qunit';

import { argument, type } from '@ember-decorators/argument';

import config from 'ember-get-config';

module('@type');

test('it works', function(assert) {
  assert.expect(0);

  class Foo extends EmberObject {
    @type('string')
    @argument
    bar;
  }

  Foo.create({ bar: 'baz' });
});

test('it works with classes', function(assert) {
  class Foo extends EmberObject {
    @type(Date)
    @argument
    bar;
  }

  const foo = Foo.create({ bar: new Date() });

  assert.throws(() => {
    foo.set('bar', 2);
  }, /bar expected value of type function Date()/)
});

test('it works with a default value', function(assert) {
  assert.expect(0);

  class Foo extends EmberObject {
    @type('string')
    @argument
    bar = 'baz';
  }

  Foo.create();
});

test('it throws if an incorrect value is provided', function(assert) {
  assert.throws(() => {
    class Foo extends EmberObject {
      @type('string')
      @argument
      bar;
    }

    Foo.create({ bar: 2 });
  }, /bar expected value of type string, but received: 2/);
});

test('it works with the class hierarchy', function(assert) {
  class Foo extends EmberObject {
    @type('string')
    @argument
    prop;
  }

  class Bar extends Foo {}

  class Baz extends Bar {}

  class Quix extends Baz {
    @type('number')
    @argument
    anotherProp = 2;
  }

  assert.throws(() => {
    Quix.create({ prop: 2 });
  }, /prop expected value of type string, but received: 2/);

  assert.throws(() => {
    Quix.create({ anotherProp: 'val' });
  }, /anotherProp expected value of type number, but received: val/);
});

test('it throws if an incorrect default default value is provided', function(assert) {
  assert.throws(() => {
    // no default
    class Foo extends EmberObject {
      @type('string')
      @argument
      bar;
    }

    Foo.create();
  }, /bar expected value of type string, but received: undefined/);

  assert.throws(() => {
    // incorrect default
    class Foo extends EmberObject {
      @type('string')
      @argument
      bar = 2;
    }

    Foo.create();
  }, /bar expected value of type string, but received: 2/);
});

test('throws if the property is set to an incorrect type', function(assert) {
  assert.throws(() => {
    // incorrect default
    class Foo extends EmberObject {
      @type('string')
      @argument
      bar = 'baz';
    }

    let foo = Foo.create();
    foo.set('bar', 2);
  }, /bar expected value of type string, but received: 2/);
});

test('it requires exactly one type argument', function(assert) {
  assert.throws(() => {
    class Foo extends EmberObject {
      @type()
      @argument
      bar;
    }

    Foo.create({ bar: 2 });
  }, /The @type decorator can only receive one type/);

  assert.throws(() => {
    class Foo extends EmberObject {
      @type
      @argument
      bar;
    }

    Foo.create({ bar: 2 });
  }, /The @type decorator can only receive one type/);

  assert.throws(() => {
    class Foo extends EmberObject {
      @type('string', 'number')
      @argument
      bar;
    }

    Foo.create({ bar: 2 });
  }, /The @type decorator can only receive one type/);
});

test('it requires primitive types or classes', function(assert) {
  assert.throws(() => {
    class Foo extends EmberObject {
      @type('aoeu')
      @argument
      bar;
    }

    Foo.create({ bar: 2 });
  }, /Unknown primitive type received: aoeu/);

  assert.throws(() => {
    class Foo extends EmberObject {
      @type(2)
      @argument
      bar;
    }

    Foo.create({ bar: 2 });
  }, /Types must either be a primitive type string, class, validator, or null or undefined, received: 2/);

  assert.throws(() => {
    class Foo extends EmberObject {
      @type(true)
      @argument
      bar;
    }

    Foo.create({ bar: 2 });
  }, /Types must either be a primitive type string, class, validator, or null or undefined, received: true/);

  assert.throws(() => {
    class Foo extends EmberObject {
      @type({})
      @argument
      bar;
    }

    Foo.create({ bar: 2 });
  }, /Types must either be a primitive type string, class, validator, or null or undefined, received: \[object Object\]/);

  assert.throws(() => {
    class Foo extends EmberObject {
      @type([])
      @argument
      bar;
    }

    Foo.create({ bar: 2 });
  }, /Types must either be a primitive type string, class, validator, or null or undefined, received:/);
});

test('it throws if types are required on an argument', function(assert) {
  config.emberArgumentDecorators.typeRequired = true;

  assert.throws(() => {
    // no default
    class Foo extends EmberObject {
      @argument
      bar;
    }

    Foo.create();
  }, /bar requires a type, add one using the @type decorator/);

  config.emberArgumentDecorators.typeRequired = false;
});

test('subclass can provide value', function(assert) {
  assert.expect(1);

  class Foo extends EmberObject {
    @type('string')
    prop;
  }

  class Bar extends Foo {
    prop = 'baz';
  }

  Bar.create();

  assert.throws(() => {
    Foo.create();
  }, /prop expected value of type string, but received: undefined/);
});

test('subtypes can be added to classes', function(assert) {
  assert.expect(1);

  class Foo extends EmberObject {
    @type('any')
    @argument
    prop;
  }

  class Bar extends Foo {
    @type('string')
    prop;
  }

  Bar.create({ prop: 'baz' });

  assert.throws(() => {
    Bar.create({ prop: 123 });
  }, /prop expected value of type string, but received: 123/);
});

test('subtypes cannot deviate from superclass type', function(assert) {
  assert.expect(1);

  class Foo extends EmberObject {
    @type('number')
    @argument
    prop;
  }

  class Bar extends Foo {
    @type('string')
    prop;
  }

  assert.throws(() => {
    Bar.create({ prop: '123' });
  }, /prop expected value of type number, but received: 123/);
});
