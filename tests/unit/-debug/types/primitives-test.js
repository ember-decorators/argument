import EmberObject from '@ember/object';
import { test, module } from 'qunit';

import { type } from '@ember-decorators/argument/type';

module('@type primitives');

const primitives = {
  array: [],
  boolean: true,
  class: class Foo extends EmberObject {},
  function: () => {},
  number: 1,
  object: {},
  string: 'string',
  NaN: NaN,
  null: null,
  undefined: undefined
}

function primitiveTypeTest(testType, subtypes) {
  subtypes = subtypes || [testType];

  test(testType, function(assert) {
    class Foo extends EmberObject {
      @type(testType) foo
    }

    for (let primitive in primitives) {
      if (subtypes.includes(primitive)) {
        Foo.create({ foo: primitives[primitive] });
        assert.ok(true, `it works for ${primitive}`)
      } else {
        assert.throws(() => {
          Foo.create({ foo: primitives[primitive] });
        }, /foo expected value of type/)
      }
    }
  });
}

primitiveTypeTest('array');
primitiveTypeTest('class');
primitiveTypeTest('boolean');
primitiveTypeTest('function');
primitiveTypeTest('number');
primitiveTypeTest('object');
primitiveTypeTest('string');
primitiveTypeTest('NaN');
primitiveTypeTest('null');
primitiveTypeTest('undefined');

primitiveTypeTest(null, ['null']);
primitiveTypeTest(undefined, ['undefined']);

primitiveTypeTest('action', ['string', 'function']);
primitiveTypeTest('any', Object.keys(primitives));
