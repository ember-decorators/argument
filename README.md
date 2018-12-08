# @ember-decorators/argument

This addon provides a set of decorators that allow you to declaratively specify argument and field
types and properties, such as mutability. It includes:

1. The `@argument` decorator, which allows you to declare a field on a component or Ember object
   as an argument it receives and provide a default value
2. Several validation decorators and helpers inspired by [ember-prop-types](https://github.com/ciena-blueplanet/ember-prop-types)
   which allow you to specify runtime validations for fields

## Usage

```js
import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { type } from '@ember-decorators/argument/type';
import { immutable } from '@ember-decorators/argument/validation';

export default class ExampleComponent extends Component {
  @argument
  @type('string')
  arg = 'default';
}
```

```html
{{example-component arg="value"}}
```

## Decorators

### `@argument`

Declares a field as an argument of the component or object and optionally will assign a default
value _unless_ one is passed in or provided by a superclass. By default components will throw
an error if an argument is provided but was not defined on the class. This behavior does not
apply to objects in general since they have much more varied use cases, and can be disabled via
a config option in `ember-cli-build`.

```js
import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';

export default class ExampleComponent extends Component {
  @argument
  arg = 'default';
}
```

```handlebars
<!-- arg === 'default' -->
{{example-component}}

<!-- arg === 'value' -->
{{example-component arg="value"}}

<!-- throws an error -->
{{example-component foo="value"}}
```

### `@type`

Declares that a field must be a specific type. Accepts exactly one type, which may either be a
string that represents a primitive type, a class that the field is an instance of, or a type created
using the type helpers.

Primitive types match those of Typescript, including:

- `any`
- `boolean`
- `null`
- `number`
- `object`
- `string`
- `symbol`
- `undefined`

You can also pass `null` and `undefined` directly as types for convenience

Type helpers include:

- `unionOf`: Produces a union type from the specified types
- `arrayOf`: Produces a type for an array of specific types
- `shapeOf`: Accepts an object of key -> type pairs, and checks the shape of the field to make sure it
  matches the object passed in. The validator only checks to make sure that the fields exist and are their
  proper types, so it is valid for all objects which fulfill the shape (structural typing)
- `optional`: Produces an optional / nullable type that, in addition to the type that was passed in,
  also allows `null` and `undefined`.

```js
import Component from '@ember/component';
import {
  type,
  arrayOf,
  unionOf,
  optional
} from '@ember-decorators/argument/type';

export default class ExampleComponent extends Component {
  @type(unionOf(null, 'string'))
  arg = 'default';

  @type(unionOf(undefined, Date))
  foo;

  @type(unionOf('string', 'number', Date))
  bar;

  @type(optional(Date))
  optionalDate; // can be either `null`, `undefined` or an instance of ´Date

  @type(unionOf(null, undefined, Date))
  optionalThroughUnion; // this is virtually identical to `optionalDate`

  @type(arrayOf('string'))
  stringArray;

  @type(arrayOf('any'))
  anyArray;

  @type(arrayOf(unionOf('string', 'number', Element)))
  unionArray;
}
```

In addition, this library includes several predefined types for convenience:

- `Action` - union type of `string` and `Function`. This is the recommended type to use for actions
  as it will improve readability and in the future provide metadata for automatic documentation generation
- `ClosureAction` - Type alias for `Function`. If you want to enforce strict usage of closure actions only
  this is the recommended type
- `Element` - Fastboot safe type alias for `window.Element`
- `Node` - Fastboot safe type alias for `window.Node`

These types can be imported from `@ember-decorators/argument/types`

## Installation

While `ember-decorators` is not a hard requirement to use this addon, it's recommended as it adds the
base class field and decorator babel transforms

```bash
ember install ember-decorators
ember install @ember-decorators/argument
```

## Configuration

You can tweak the following settings in your `config/environment.js` under the `@ember-decorators/argument` namespace:

### `typeRequired`

**Type**: `Boolean` | **Default**: `false`

_For example_

```
module.exports = function (environment) {
  let ENV = {
    ...
    '@ember-decorators/argument': {
      typeRequired: true
    }
    ...
```

If enabled, requires you to also specify a [`@type`](#type) for every [`@argument`](#argument).

**Note**: Enabling this option breaks addons that use @ember-decorators/argument, but chose to not specify types for their arguments. See #29 for more information.

### `ignoreComponentsWithoutValidations`

**Type**: `Boolean` | **Default**: `false`

_For example_

```
module.exports = function (environment) {
  let ENV = {
    ...
    '@ember-decorators/argument': {
      ignoreComponentsWithoutValidations: true
    }
    ...
```

If enabled, components that don't have any validations defined on them will not get validated. This is very handy, if you're adding this addon to a pre-existing codebase, since it allows you to progressively migrate your components one by one.

## Running

- `ember serve`
- Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

- `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
- `ember test`
- `ember test --server`

## Building

- `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
