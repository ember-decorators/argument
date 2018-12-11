import { module, test } from 'qunit';
import { isExtensionOf } from '@ember-decorators/argument/-private/utils/object';

module('Unit | Utility | -private/utils/object', function() {
  module('isExtensionOf', function() {
    test('it detects a subclass', function(assert) {
      class Foo {}
      class Bar extends Foo {}
      class Bax extends Bar {}

      assert.ok(isExtensionOf(Bax, Foo));
    });

    test('it detects a mismatch', function(assert) {
      class Foo {}
      class Bar {}

      assert.notOk(isExtensionOf(Foo, Bar));
    });
  });
});
