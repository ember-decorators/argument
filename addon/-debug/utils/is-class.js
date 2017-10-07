import EmberObject from '@ember/object';

export default function isClass(value) {
  return EmberObject.detect(value) || (
    typeof value === 'function'
    && value.hasOwnProperty('prototype')
    && !value.hasOwnProperty('arguments')
  );
}
