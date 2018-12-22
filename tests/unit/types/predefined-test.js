import { test, module } from 'qunit';
import EmberObject from '@ember/object';

import { argument } from '@ember-decorators/argument';
import {
  Action,
  ClassicAction,
  Element,
  Node
} from '@ember-decorators/argument/types';

module('Unit | types | predefined types', function() {
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
        @argument(testType) foo;
      }

      for (let primitive in primitives) {
        const value = primitives[primitive];

        if (subtypes.includes(primitive)) {
          Foo.create({ foo: value });
          assert.ok(true, `it works for ${primitive}`);
        } else {
          assert.throws(
            () => {
              Foo.create({ foo: value });
            },
            /Foo#foo expected value of type/,
            `it works for ${primitive}`
          );
        }
      }
    });
  }

  predefinedTypeTest('boolean');
  predefinedTypeTest('number', ['number', 'NaN']);
  predefinedTypeTest('string');
  predefinedTypeTest('null');
  predefinedTypeTest('undefined');

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
  predefinedTypeTest(Action, ['function', 'class']);
  predefinedTypeTest(ClassicAction, ['string', 'function', 'class']);

  predefinedTypeTest(Element, ['element']);
  predefinedTypeTest(Node, ['element', 'node']);
});
