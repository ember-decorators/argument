import EmberObject from '@ember/object';
import { addObserver } from '@ember/object/observers';
import { test, module } from 'qunit';

import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
import { argument } from '@ember-decorators/argument';
import { type } from '@ember-decorators/argument/type';

import { gte } from 'ember-compatibility-helpers';

import config from 'ember-get-config';

module('@type', function() {
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
    }, /Foo#bar expected value of type function Date()/);
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
    }, /Foo#bar expected value of type string during 'init', but received: 2/);
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
    }, /Quix#prop expected value of type string during 'init', but received: 2/);

    assert.throws(() => {
      Quix.create({ anotherProp: 'val' });
    }, /Quix#anotherProp expected value of type number during 'init', but received: 'val'/);
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
    }, /Foo#bar expected value of type string during 'init', but received: undefined/);

    assert.throws(() => {
      // incorrect default
      class Foo extends EmberObject {
        @type('string')
        @argument
        bar = 2;
      }

      Foo.create();
    }, /Foo#bar expected value of type string during 'init', but received: 2/);
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
    }, /Foo#bar expected value of type string during 'set', but received: 2/);
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
  });

  test('it throws if types are required on an argument', function(assert) {
    config['@ember-decorators/argument'].typeRequired = true;

    assert.throws(() => {
      // no default
      class Foo extends EmberObject {
        @argument
        bar;
      }

      Foo.create();
    }, /Foo#bar requires a type, add one using the @type decorator/);

    config['@ember-decorators/argument'].typeRequired = false;
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
    }, /prop expected value of type string during 'init', but received: undefined/);
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
    }, /Bar#prop expected value of type string during 'init', but received: 123/);
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
    }, /Bar#prop expected value of type number during 'init', but received: '123'/);
  });

  test('typed values can be set to their own value', function(assert) {
    assert.expect(2);

    class Foo extends EmberObject {
      @type('number')
      prop = 123;
    }

    const foo = Foo.create();

    // Works by default
    assert.equal(foo.get('prop'), 123, 'default value provided');

    // Works when dependent key is set
    foo.set('prop', 123);
    assert.equal(foo.get('prop'), 123, 'no change');
  });

  test('typed value can be provided by computed', function(assert) {
    class Foo extends EmberObject {
      @type('number')
      prop;
    }

    class Bar extends Foo {
      value = 123;

      @computed('value')
      get prop() {
        return this.value;
      }

      set prop(value) {
        this.set('value', value);
      }
    }

    const bar = Bar.create();

    // Works by default
    assert.equal(bar.get('prop'), 123, 'default value provided');

    // Works when dependent key is set
    bar.set('value', 456);
    assert.equal(bar.get('prop'), 456, 'can set dependent key');

    // Works when set directly
    bar.set('prop', 789);
    assert.equal(bar.get('value'), 789, 'setter works correctly');
    assert.equal(bar.get('prop'), 789, 'correct value set');

    // Throws when computed returns incorrect value
    assert.throws(() => {
      bar.set('value', 'foo');
      bar.get('prop');
    }, /Bar#prop expected value of type number during 'get', but received: 'foo'/);

    // Throws when set to incorrect value
    assert.throws(() => {
      bar.set('prop', 'foo');
    }, /Bar#prop expected value of type number during 'set', but received: 'foo'/);
  });

  test('typed value can be provided by alias', function(assert) {
    class Foo extends EmberObject {
      @type('number')
      prop;
    }

    class Bar extends Foo {
      value = 123;

      @alias('value') prop;
    }

    const bar = Bar.create();

    // Works by default
    assert.equal(bar.get('prop'), 123, 'default value provided');

    // Works when dependent key is set
    bar.set('value', 456);
    assert.equal(bar.get('prop'), 456, 'can set dependent key');

    // Works when set directly
    bar.set('prop', 789);
    assert.equal(bar.get('value'), 789, 'setter works correctly');
    assert.equal(bar.get('prop'), 789, 'correct value set');

    // Throws when computed returns incorrect value
    assert.throws(() => {
      bar.set('value', 'foo');
      bar.get('prop');
    }, /Bar#prop expected value of type number during 'get', but received: 'foo'/);

    // Throws when set to incorrect value
    assert.throws(() => {
      bar.set('prop', 'foo');
    }, /Bar#prop expected value of type number during 'set', but received: 'foo'/);
  });

  test('typed value can be provided by native getter/setter', function(assert) {
    class Foo extends EmberObject {
      @type('number')
      prop;
    }

    class Bar extends Foo {
      value = 123;

      get prop() {
        return this.value;
      }

      set prop(value) {
        this.value = value;
      }
    }

    const bar = Bar.create();

    // Works by default
    assert.equal(bar.get('prop'), 123, 'default value provided');

    // Works when dependent key is set
    bar.value = 456;
    assert.equal(bar.get('prop'), 456, 'can set dependent key');

    // Works when set directly
    bar.set('prop', 789);
    assert.equal(bar.value, 789, 'setter works correctly');
    assert.equal(bar.get('prop'), 789, 'correct value set');

    // Throws when computed returns incorrect value
    assert.throws(() => {
      bar.value = 'foo';
      bar.get('prop');
    }, /Bar#prop expected value of type number during 'get', but received: 'foo'/);

    // Throws when set to incorrect value
    assert.throws(() => {
      bar.set('prop', 'foo');
    }, /Bar#prop expected value of type number during 'set', but received: 'foo'/);
  });

  test('typed value can be watched', function(assert) {
    class Foo extends EmberObject {
      @type('number')
      prop = 123;

      @computed('prop')
      get watcher() {
        return this.get('prop');
      }
    }

    const foo = Foo.create();

    // Works by default
    assert.equal(foo.get('watcher'), 123, 'default value provided');

    // Works when dependent key is set
    foo.set('prop', 456);
    assert.equal(foo.get('prop'), 456, 'can set dependent key');
    assert.equal(foo.get('watcher'), 456, 'computed value is updated');
  });

  test('typed value does not trigger mandatory setter', function(assert) {
    assert.expect(3);

    class Foo extends EmberObject {
      init() {
        super.init();

        addObserver(this, 'prop', () => {
          assert.ok(true, 'observer called');
        });
      }

      @type('number')
      prop = 123;
    }

    const foo = Foo.create();

    // Works by default
    assert.equal(foo.get('prop'), 123, 'default value provided');

    // Works when dependent key is set
    foo.set('prop', 456);
    assert.equal(foo.get('prop'), 456, 'can set dependent key');
  });

  test('typed native setter does not trigger property notifications if value is unchanged', function(assert) {
    let value = 0;

    class Foo extends EmberObject {
      @type('number')
      get prop() {
        return 123;
      }

      set prop(value) {
        // do nothing
      }

      @computed('prop')
      get otherProp() {
        return value++;
      }
    }

    const foo = Foo.create();

    assert.equal(foo.get('otherProp'), 0, 'computed is correct before');

    foo.set('prop', 123);

    assert.equal(foo.get('otherProp'), 0, 'computed did not change');
  });

  test('native setters can return a different value than given', function(assert) {
    assert.expect(3);

    class Foo extends EmberObject {
      value = 123;

      @type('number')
      get prop() {
        return this.value;
      }

      set prop(value) {
        if (typeof value === 'number') {
          this.value = value;
        }
      }
    }

    const foo = Foo.create();

    // Works by default
    assert.equal(foo.get('prop'), 123, 'default value provided');

    // Works when dependent key is set
    foo.set('prop', 456);
    assert.equal(foo.get('prop'), 456, 'can set dependent key');

    // Setter can choose not to set value
    foo.set('prop', undefined);
    assert.equal(foo.get('prop'), 456, 'can set dependent key');
  });

  test('computed setters can return a different value than given', function(assert) {
    assert.expect(3);

    class Foo extends EmberObject {
      value = 123;

      @type('number')
      @computed('value')
      get prop() {
        return this.get('value');
      }

      set prop(value) {
        if (typeof value === 'number') {
          this.set('value', value);
        }

        return this.get('value');
      }
    }

    const foo = Foo.create();

    // Works by default
    assert.equal(foo.get('prop'), 123, 'default value provided');

    // Works when dependent key is set
    foo.set('prop', 456);
    assert.equal(foo.get('prop'), 456, 'can set dependent key');

    // Setter can choose not to set value
    foo.set('prop', undefined);
    assert.equal(foo.get('prop'), 456, 'can set dependent key');
  });

  if (gte('3.1.0')) {
    test('works with native getters', function(assert) {
      assert.expect(3);

      class Foo extends EmberObject {
        @type('number')
        prop = 123;
      }

      const foo = Foo.create();

      // Works by default
      assert.equal(foo.prop, 123, 'default value provided');

      // Works when dependent key is set
      foo.set('prop', 456);
      assert.equal(foo.prop, 456, 'no change');

      assert.throws(() => {
        foo.set('prop', 'bar');
      }, /Foo#prop expected value of type number during 'set', but received: 'bar'/);
    });
  }
});
