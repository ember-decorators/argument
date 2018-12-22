/* eslint-env node */
'use strict';

const Funnel = require('broccoli-funnel');
const VersionChecker = require('ember-cli-version-checker');
const log = require('debug')('ember-decorators:argument');

function isProductionEnv() {
  return /production/.test(process.env.EMBER_ENV);
}

function addDefaults(options = {}) {
  // Handle the old option, in case people forget to update it
  if (options.disableCodeStripping) {
    options.enableCodeStripping = true;
  }

  return Object.assign({ enableCodeStripping: true }, options);
}

module.exports = {
  name: require('./package').name,

  _getParentOptions() {
    let options;

    // The parent can either be an Addon or a Project. If it's an addon,
    // we want to use the app instead. This public method probably wasn't meant
    // for this, but it's named well enough that we can use it for this purpose.
    if (this.parent && !this.parent.isEmberCLIProject) {
      options = this.parent.options = this.parent.options || {};
    } else {
      options = this.app.options = this.app.options || {};
    }

    return options;
  },

  shouldStripAddon() {
    return isProductionEnv() && this.addonOptions.enableCodeStripping;
  },

  /**
   * Overwritten to remove implementation in Production builds, if the user does not
   * disable stripping
   *
   * @param {BroccoliNode} tree
   */
  treeForAddon(tree) {
    const filteredTree = this.shouldStripAddon()
      ? new Funnel(tree, {
          exclude: ['-private', 'types.js', 'index.js']
        })
      : tree;

    return this._super.treeForAddon.call(this, filteredTree);
  },

  stripImports(babelOptions) {
    babelOptions.plugins.push([
      require.resolve('babel-plugin-filter-imports'),
      {
        imports: {
          '@ember-decorators/argument': ['argument'],
          '@ember-decorators/argument/types': [
            'arrayOf',
            'optional',
            'oneOf',
            'shapeOf',
            'unionOf',
            'Action',
            'ClassicAction',
            'Element',
            'Node'
          ]
        }
      }
    ]);
  },

  included(app) {
    this._super.included.apply(this, arguments);

    let parentOptions = this._getParentOptions();

    this.addonOptions = addDefaults(
      parentOptions['@ember-decorators/argument']
    );

    log('Using options %o', this.addonOptions);

    if (
      isProductionEnv() &&
      !this._registeredWithBabel &&
      !this.addonOptions.disableCodeStripping
    ) {
      let babelChecker = new VersionChecker(this.parent).for(
        'ember-cli-babel',
        'npm'
      );

      if (babelChecker.gte('7.0.0')) {
        // Create babel options if they do not exist
        parentOptions.babel = parentOptions.babel || {};
        parentOptions.babel.plugins = parentOptions.babel.plugins || [];

        this.stripImports(parentOptions.babel);
      } else {
        app.project.ui.writeWarnLine(
          '@ember-decorators/argument: You are using an unsupported ember-cli-babel version,' +
            'decorators will not be stripped automatically'
        );
      }

      this._registeredWithBabel = true;
    }
  }
};
