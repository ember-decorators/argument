import { getWithDefault } from '@ember/object';
import fullApplicationConfig from 'ember-get-config';

const addonConfig = getWithDefault(
  fullApplicationConfig,
  '@ember-decorators/argument',
  {}
);

const argumentWhitelistConfig = getWithDefault(
  addonConfig,
  'argumentWhitelist',
  []
);

export function extractArgumentWhitelist(config) {
  config = config || [];

  return Array.isArray(config)
    ? config
    : [
        ...getWithDefault(config, 'startsWith', []).map(
          startsWith => new RegExp(`^${startsWith}`)
        ),
        ...getWithDefault(config, 'endsWith', []).map(
          endsWith => new RegExp(`${endsWith}$`)
        ),
        ...getWithDefault(config, 'includes', []).map(
          includes => new RegExp(includes)
        ),
        ...getWithDefault(config, 'matches', [])
      ];
}

export const argumentWhitelist = extractArgumentWhitelist(
  argumentWhitelistConfig
);
