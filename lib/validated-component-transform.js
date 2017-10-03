/* eslint-env node */
var path = require('path');

function removeImports(babel) {
  const t = babel.types;

  return {
    name: 'remove-filtered-imports',
    visitor: {
      ImportDeclaration(path) {
        if (path.node.source.value === '@ember/component') {
          path.get('source').replaceWith(
            t.stringLiteral('ember-argument-decorators/-debug/validated-component')
          );
        }
      }
    }
  };
}

removeImports.baseDir = function() {
  return path.join(__dirname, '../');
};

module.exports = removeImports;
