import EmberObject from '@ember/object';
import { test, module } from 'qunit';

module('basic tests');

test('validations do not cause errors on unvalidated objects', function(assert) {
  class Foo extends EmberObject {}

  const foo = Foo.create({ bar: 'baz' });

  assert.equal(foo.get('bar'), 'baz', 'everything works correctly');
});
