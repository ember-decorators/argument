import EmberObject from '@ember/object';
import { test, module } from 'qunit';

import { type } from '@ember-decorators/argument/type';
import {
  Action,
  ClosureAction,
  Element,
  Node
} from '@ember-decorators/argument/types';

module('@type predefined types');

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
  undefined: undefined,
  element: document.createElement('div'),
  node: document.createTextNode('')
};

function predefinedTypeTest(testType, subtypes) {
  subtypes = subtypes || [testType];

  test(testType, function(assert) {
    class Foo extends EmberObject {
      @type(testType) foo;
    }

    for (let primitive in primitives) {
      if (subtypes.includes(primitive)) {
        Foo.create({ foo: primitives[primitive] });
        assert.ok(true, `it works for ${primitive}`);
      } else {
        assert.throws(() => {
          Foo.create({ foo: primitives[primitive] });
        }, /Foo#foo expected value of type/);
      }
    }
  });
}

predefinedTypeTest('boolean');
predefinedTypeTest('number', ['number', 'NaN']);
predefinedTypeTest('string');
predefinedTypeTest('null');
predefinedTypeTest('undefined');

predefinedTypeTest(null, ['null']);
predefinedTypeTest(undefined, ['undefined']);

predefinedTypeTest('any', Object.keys(primitives));
predefinedTypeTest('object', [
  'class',
  'function',
  'object',
  'array',
  'element',
  'node'
]);

// Action will also accept `class` since it is an instance of a Function
predefinedTypeTest(Action, ['string', 'function', 'class']);
predefinedTypeTest(ClosureAction, ['function', 'class']);

predefinedTypeTest(Element, ['element']);
predefinedTypeTest(Node, ['element', 'node']);
