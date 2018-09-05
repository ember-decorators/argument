/* eslint-env node */
'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
const Funnel = require('broccoli-funnel');

function isProductionEnv() {
  return /production/.test(process.env.EMBER_ENV);
}

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    'ember-cli-babel': {
      throwUnlessParallelizable: true,
    },
    trees: {
      tests: isProductionEnv() ? new Funnel('tests', { exclude: ['unit/-debug'] }) : 'tests'
    }
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree();
};
