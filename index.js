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
  name: 'ember-argument-decorators',

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
    const filteredTree = !(isProductionEnv() && !this.disableCodeStripping) ? tree : new Funnel(tree, {
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

    if (isProductionEnv() && !this.disableCodeStripping) {
      opts.plugins.push(
        [FilterImports, {
          imports: {
            'ember-argument-decorators/-debug': [
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

    this.disableCodeStripping = parentOptions.emberArgumentDecorators && parentOptions.emberArgumentDecorators.disableCodeStripping

    this._setupBabelOptions();

    if (!this._registeredWithBabel) {
      let babelChecker = new VersionChecker(this.parent).for('ember-cli-babel', 'npm');

      if (babelChecker.satisfies('^6.0.0-beta.1')) {
        // Create babel options if they do not exist
        parentOptions.babel = parentOptions.babel || {};

        // Create and pull off babel plugins
        let plugins = parentOptions.babel.plugins = parentOptions.babel.plugins || [];

        if (isProductionEnv() && !this.disableCodeStripping) {
          plugins.push(
            [FilterImports, {
              imports: {
                'ember-argument-decorators/types': [
                  'arrayOf',
                  'shapeOf',
                  'subclassOf',
                  'unionOf'
                ],
                'ember-argument-decorators': [
                  'type',
                  'required',
                  'immutable'
                ],
                'ember-argument-decorators/errors': [
                  'MutabilityError',
                  'RequiredFieldError',
                  'TypeError'
                ]
              }
            }]
          );
        } else {
          plugins.push([ValidatedComponentTransform]);
        }
      } else {
        app.project.ui.writeWarnLine(
          'ember-legacy-class-transform: You are using an unsupported ember-cli-babel version,' +
          'legacy class constructor transform will not be included automatically'
        );
      }

      this._registeredWithBabel = true;
    }
  }
};
