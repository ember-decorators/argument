/* eslint-disable no-unused-vars */

import { module, test, skip } from 'qunit';
import EmberObject from '@ember/object';
import { addObserver } from '@ember/object/observers';
import { argument } from '@ember-decorators/argument';
import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';

module('Unit | @argument', function() {
  test('there are no affects on objects without validation', function(assert) {
    class Foo extends EmberObject {
      prop = 1;
    }

    const foo = Foo.create({ prop: 'wrong type' });

    assert.equal(foo.get('prop'), 'wrong type');
  });

  test('setting the property to the wrong type', function(assert) {
    class Foo extends EmberObject {
      @argument('number')
      prop = 1;
    }

    assert.throws(function() {
      Foo.create({ prop: 'wrong type' });
    }, /Foo#prop expected value of type number during 'init', but received: 'wrong type'/);
  });

  test('when the default value does not match', function(assert) {
    class BaseWithWrongType extends EmberObject {
      @argument('number')
      prop = 'some value';
    }

    class BaseWithRightType extends BaseWithWrongType {
      prop = 1;
    }

    assert.throws(function() {
      BaseWithWrongType.create({});
    }, /BaseWithWrongType#prop expected value of type number during 'init', but received: 'some value'/);

    const overrideWrongType = BaseWithWrongType.create({ prop: 1 });
    assert.equal(
      overrideWrongType.get('prop'),
      1,
      'Overrode the incorrect default type'
    );

    const rightType = BaseWithRightType.create();
    assert.equal(rightType.get('prop'), 1, 'Set the default correctly');
  });

  test('it works with the class hierarchy', function(assert) {
    class Foo extends EmberObject {
      @argument('string') prop;
    }

    class Bar extends Foo {}

    class Baz extends Bar {}

    class Quix extends Baz {
      @argument('number')
      anotherProp = 2;
    }

    assert.throws(() => {
      Quix.create({ prop: 2 });
    }, /Quix#prop expected value of type string during 'init', but received: 2/);

    assert.throws(() => {
      Quix.create({ prop: 'val', anotherProp: 'val' });
    }, /Quix#anotherProp expected value of type number during 'init', but received: 'val'/);
  });

  test('preventing overriding type in subclass', function(assert) {
    class Foo extends EmberObject {
      @argument('number') prop;
    }

    class Bar extends Foo {
      @argument('string') prop;
    }

    assert.throws(() => {
      Bar.create({ prop: 'some string value' });
    }, /Bar#prop expected value of type number during 'init', but received: 'some string value'/);
  });

  module('validating usage', function() {
    test('ensuring that a type is provided', function(assert) {
      assert.throws(function() {
        class Foo extends EmberObject {
          @argument() bar;
        }
      }, /A type definition must be provided to `@argument`/);
    });

    test('ensuring that `argument` is invoked as a function', function(assert) {
      assert.throws(function() {
        class Foo extends EmberObject {
          @argument bar;
        }
      }, /`@argument` must be passed a type to validate against/);
    });

    test('ensuring only one type is provided', function(assert) {
      assert.throws(function() {
        class Foo extends EmberObject {
          @argument('string', 'number') prop;
        }
      }, /`@argument` must only be passed one type definition/);
    });
  });

  module('validating the provided type', function() {
    test('instances are not supported', function(assert) {
      assert.throws(() => {
        class Foo extends EmberObject {
          @argument(2) bar;
        }

        Foo.create({ bar: 2 });
      }, /Types must either be a primitive type string, class, validator, or null or undefined, received: 2/);

      assert.throws(() => {
        class Bar extends EmberObject {
          @argument(true) bar;
        }

        Bar.create({ bar: 2 });
      }, /Types must either be a primitive type string, class, validator, or null or undefined, received: true/);
    });

    test('checking the name of types', function(assert) {
      assert.throws(() => {
        class Foo extends EmberObject {
          @argument('aoeu') bar;
        }

        Foo.create({ bar: 2 });
      }, /Unknown primitive type received: aoeu/);
    });
  });

  module('compatibility with Ember', function() {
    test('typed value can be provided by computed', function(assert) {
      class Foo extends EmberObject {
        @argument('number') prop;
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
        @argument('number') prop;
        j;
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

    test('typed value can be watched', function(assert) {
      class Foo extends EmberObject {
        @argument('number')
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

        @argument('number')
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
        @argument('number')
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
  });

  module('compatibility with native classes', function() {
    // Skipped because the native getter/setter in the parent class is currently
    // clobbered by the definition of the instance property in the constructor
    // of the base class
    skip('typed value can be provided by getter/setter', function(assert) {
      class Foo extends EmberObject {
        @argument('number') prop;
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

    test('native setters can return a different value than given', function(assert) {
      assert.expect(3);

      class Foo extends EmberObject {
        value = 123;

        @argument('number')
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

    test('works with native getters', function(assert) {
      class Foo extends EmberObject {
        @argument('number')
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
  });
});
