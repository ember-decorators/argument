import { module, test } from 'qunit';
import {
  argumentWhitelist,
  extractArgumentWhitelist
} from '@ember-decorators/argument/-private/config';

module('Unit | Utility | -private/config', function() {
  module('argumentWhitelist', function() {
    test('it resolves the application configuration', function(assert) {
      assert.deepEqual(
        argumentWhitelist,
        [/^hotReloadCUSTOM/, 'exact-attribute'],
        'Matches the dummy configuration'
      );
    });
  });

  module('extractArgumentWhitelist', function() {
    test('no configuration', function(assert) {
      assert.deepEqual(extractArgumentWhitelist({}), [], 'An empty object');
      assert.deepEqual(extractArgumentWhitelist([]), [], 'An empty array');
      assert.deepEqual(extractArgumentWhitelist(undefined), [], '`undefined`');
      assert.deepEqual(extractArgumentWhitelist(null), [], '`null`');
    });

    module('an array', function() {
      test('an array of strings', function(assert) {
        assert.deepEqual(
          extractArgumentWhitelist(['foo', 'bar']),
          ['foo', 'bar'],
          'It returns the array of strings'
        );
      });
    });

    module('an object with semantic sets of matchers', function() {
      test('.startsWith', function(assert) {
        assert.deepEqual(
          extractArgumentWhitelist({
            startsWith: ['foo']
          }),
          [/^foo/],
          'Elements are turned into the right regex'
        );
      });

      test('.endsWith', function(assert) {
        assert.deepEqual(
          extractArgumentWhitelist({
            endsWith: ['foo']
          }),
          [/foo$/],
          'Elements are turned into the right regex'
        );
      });

      test('.includes', function(assert) {
        assert.deepEqual(
          extractArgumentWhitelist({
            includes: ['foo']
          }),
          [/foo/],
          'Elements are turned into the right regex'
        );
      });

      test('.matches', function(assert) {
        assert.deepEqual(
          extractArgumentWhitelist({
            matches: ['foo']
          }),
          ['foo'],
          'Elements are passed through as strings'
        );
      });
    });
  });
});
