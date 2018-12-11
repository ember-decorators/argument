import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { layout } from '@ember-decorators/component';

import template from '../templates/components/greeter-component';

@layout(template)
export default class GreeterComponentComponent extends Component {
  @argument('string')
  greeting = 'Hello';
}
