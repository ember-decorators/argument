import { computed } from '@ember/object';

import { SUPPORTS_NEW_COMPUTED } from 'ember-compatibility-helpers';

export default function makeComputed(desc) {
  if (SUPPORTS_NEW_COMPUTED) {
    return computed(desc);
  } else {
    const { get, set } = desc;

    return computed(function (key, value) {
      if (arguments.length > 1) {
        return set.call(this, key, value);
      }

      return get.call(this);
    });
  }
}
