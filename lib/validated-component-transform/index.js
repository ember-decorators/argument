/* eslint-env node */

function covertValidateComponents(babel) {
  const t = babel.types;

  return {
    name: 'convert-validated-components',
    visitor: {
      ImportDeclaration(path) {
        if (path.node.source.value === '@ember/component') {
          path.replaceWith(
            t.importDeclaration(
              [t.importDefaultSpecifier(t.identifier('Component'))],
              t.stringLiteral(
                '@ember-decorators/argument/-debug/validated-component'
              )
            )
          );
        }
      }
    }
  };
}

covertValidateComponents.baseDir = function() {
  return __dirname;
};

covertValidateComponents._parallelBabel = {
  requireFile: __filename
};

module.exports = covertValidateComponents;
