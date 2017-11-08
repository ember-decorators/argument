import resolver from './helpers/resolver';
import {
  setResolver
} from 'ember-qunit';
import { start } from 'ember-cli-qunit';

import config from 'ember-get-config';

config.emberDecoratorsArgument = {
  typeRequired: false,
  ignoreComponentsWithoutValidations: false
};

setResolver(resolver);
start();
