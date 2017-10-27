export default function isClass(value) {
  // eslint-disable-next-line
  return Ember.CoreObject.detect(value);
}
