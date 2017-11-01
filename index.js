/* eslint-env node */
'use strict';

const FilterImports = require('babel-plugin-filter-imports');
const ValidatedComponentTransform = require('./lib/validated-component-transform');
const VersionChecker = require('ember-cli-version-checker');
const Funnel = require('broccoli-funnel');

function isProductionEnv() {
  return /production/.test(process.env.EMBER_ENV);
}

module.exports = {
  name: '@ember-decorators/arguments',

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

  treeForAddon(tree) {
    const filteredTree = !(isProductionEnv() && !this.addonOptions.disableCodeStripping) ? tree : new Funnel(tree, {
      exclude: [
        '-debug',
        'errors.js',
        'types.js'
      ]
    });


    return this._super(filteredTree);
  },

  _setupBabelOptions() {
    if (this._hasSetupBabelOptions) {
      return;
    }

    const opts = this.options.babel = this.options.babel || {};

    opts.plugins = opts.plugins || [];

    opts.loose = true;

    if (isProductionEnv() && !this.addonOptions.disableCodeStripping) {
      opts.plugins.push(
        [FilterImports, {
          imports: {
            '@ember-decorators/arguments/-debug': [
              'immutable',
              'required',
              'type',
              'validationDecorator'
            ]
          }
        }]
      );
    }

    this._hasSetupBabelOptions = true;
  },

  included(app) {
    this._super.included.apply(this, arguments);

    let parentOptions = this._getParentOptions();

    this.addonOptions = parentOptions.emberArgumentDecorators || {};

    this._setupBabelOptions();

    if (!this._registeredWithBabel) {
      let babelChecker = new VersionChecker(this.parent).for('ember-cli-babel', 'npm');

      if (babelChecker.satisfies('^6.0.0-beta.1')) {
        // Create babel options if they do not exist
        parentOptions.babel = parentOptions.babel || {};

        // Create and pull off babel plugins
        let plugins = parentOptions.babel.plugins = parentOptions.babel.plugins || [];

        if (isProductionEnv() && !this.addonOptions.disableCodeStripping) {
          plugins.push(
            [FilterImports, {
              imports: {
                '@ember-decorators/arguments/types': [
                  'arrayOf',
                  'shapeOf',
                  'subclassOf',
                  'unionOf'
                ],
                '@ember-decorators/arguments': [
                  'type',
                  'required',
                  'immutable'
                ],
                '@ember-decorators/arguments/errors': [
                  'MutabilityError',
                  'RequiredFieldError',
                  'TypeError'
                ]
              }
            }]
          );
        } else if (!this.addonOptions.disableValidatedComponent) {
          plugins.push(ValidatedComponentTransform);
        }
      } else {
        app.project.ui.writeWarnLine(
          '@ember-decorators/arguments: You are using an unsupported ember-cli-babel version,' +
          'decorators will not be stripped automatically'
        );
      }

      this._registeredWithBabel = true;
    }
  }
};
