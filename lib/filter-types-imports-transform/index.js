/* eslint-env node */

function filterTypesImports(/* babel */) {
  return {
    name: 'convert-validated-components',
    visitor: {
      ImportDeclaration(path) {
        if (path.node.source.value === '@ember-decorators/argument/types') {
          path.remove();
        }
      }
    }
  };
}

filterTypesImports.baseDir = function() {
  return __dirname;
};

filterTypesImports._parallelBabel = {
  requireFile: __filename
};

module.exports = filterTypesImports;
