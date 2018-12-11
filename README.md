# @ember-decorators/argument

This addon provides a decorator that allows you to declaratively specify component arguments. Through it, you can have run-time type checking of component usage.

## Usage

```js
import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';

export default class ExampleComponent extends Component {
  @argument('string')
  arg = 'default';
}
```

```hbs
{{example-component arg="value"}}
```

For each property that your component should be given, the `@argument` decorator should be applied to the property definition. It is passed a "type", which you can read more about below.

When rendering a component that uses `@argument`, the initial value of the property will be validated against the given type. Each time the property is changed, the new value will also be validated. If a mismatch is found, an error is thrown describing what went wrong.

In addition, any unexpected arguments to a component will also cause an error.

### Defining Types

For primitives types, the name should be provided as a string (as with `string` in the example above). The available types match those of Typescript, including:

- `any`
- `boolean`
- `null`
- `number`
- `object`
- `string`
- `symbol`
- `undefined`

There are also a number of helpers that can be used to validate against a more complex or specific type:

- `unionOf`: Produces a union type from the specified types
- `arrayOf`: Produces a type for an array of specific types
- `shapeOf`: Accepts an object of key -> type pairs, and checks the shape of the field to make sure it
  matches the object passed in. The validator only checks to make sure that the fields exist and are their
  proper types, so it is valid for all objects which fulfill the shape (structural typing)
- `optional`: Produces an optional / nullable type that, in addition to the type that was passed in,
  also allows `null` and `undefined`.

```js
import Component from '@ember/component';
import { argument } from '@ember-decorators/argument';
import { arrayOf, unionOf, optional } from '@ember-decorators/argument/types';

export default class ExampleComponent extends Component {
  @argument(unionOf(null, 'string'))
  arg = 'default';

  @argument(unionOf(undefined, Date))
  foo;

  @argument(unionOf('string', 'number', Date))
  bar;

  @argument(optional(Date))
  optionalDate; // can be either `null`, `undefined` or an instance of ´Date

  @argument(unionOf(null, undefined, Date))
  optionalThroughUnion; // this is virtually identical to `optionalDate`

  @argument(arrayOf('string'))
  stringArray;

  @argument(arrayOf('any'))
  anyArray;

  @argument(arrayOf(unionOf('string', 'number', Element)))
  unionArray;
}
```

In addition, this library includes several predefined types for convenience:

- `Action` - union type of `string` and `Function`. This is the recommended type to use for actions as it will improve readability and in the future provide metadata for automatic documentation generation
- `ClosureAction` - Type alias for `Function`. If you want to enforce strict usage of closure actions only this is the recommended type
- `Element` - Fastboot safe type alias for `window.Element`
- `Node` - Fastboot safe type alias for `window.Node`

These types can also be imported from `@ember-decorators/argument/types`

## Installation

While `ember-decorators` is not a hard requirement to use this addon, it's recommended as it adds the base class field and decorator babel transforms

```bash
ember install ember-decorators
ember install @ember-decorators/argument
```

## Configuration

### `enableCodeStripping`

**Type**: `Boolean` | **Default**: `true`

By default most of the code provided by this addon is removed in a Production build of your application. This way you can create a great development experience when writing your application, but prevent your users from paying the download or runtime cost of the validation. Both the runtime of the library, and any usage of the `@argument` decorator in your code, will be removed.

However, if the process seems buggy or you want the validation in production, setting this flag to `false` will prevent any code from being removed.

#### Example

```javascript
// ember-cli-build.js
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    '@ember-decorators/argument': {
      enableCodeStripping: false
    }
  });

  return app.toTree();
};
```

## Running

- `ember serve`
- Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

- `npm test`
- `npm run test:all` (Runs `ember try:each` to test your addon against multiple Ember versions)
- `ember test --server`

## Building

- `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
