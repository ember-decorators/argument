# @ember-decorators/arguments

This addon provides a set of decorators that allow you to declaratively specify argument and field
types and properties, such as mutability. It includes:

1. The `@argument` decorator, which allows you to declare a field on a component or Ember object
as an argument it receives and provide a default value
2. Several validation decorators and helpers inspired by [ember-prop-types](https://github.com/ciena-blueplanet/ember-prop-types)
which allow you to specify runtime validations for fields

## Usage

```js
import Component from '@ember/component';
import { argument, type, immutable } from '@ember-decorators/arguments';

export default class ExampleComponent extends Component {
  @argument
  @type('string')
  @immutable
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
import { argument } from '@ember-decorators/arguments';

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

Primitive types include:

* `array`
* `boolean`
* `function`
* `number`
* `object`
* `string`
* `symbol`
* `null`
* `undefined`
* `NaN`

Each of the above maps directly to their respective Javascript primitive types. In addition, there are
several special primitives:

* `any`: Any type of value
* `action`: Union type of `string` and `function`. Use this to declare actions that the component sends
* `class`: Any function that extends from Ember Object (we want to allow this to work with ES Classes in the future, stay tuned!)

You can also pass `null` and `undefined` directly as types for convenience

Type helpers include:

* `unionOf`: Produces a union type from the specified types
* `arrayOf`: Produces a type for an array of specific types
* `shapeOf`: Accepts an object of key -> type pairs, and checks the shape of the field to make sure it
matches the object passed in. The validator only checks to make sure that the fields exist and are their
proper types, so it is valid for all objects which fulfill the shape (structural typing)
* `subclassOf`: Checks if the value is an instance of a subclass of the specified type

```js
import Component from '@ember/component';
import { type } from '@ember-decorators/arguments';

export default class ExampleComponent extends Component {
  @type(null, 'string')
  arg = 'default';

  @type(undefined, Date)
  foo;

  @type(unionOf('string', 'number', Date))
  bar;

  @type(
    arrayOf(
      unionOf(
        'string',
        'number',
        Element
      )
    )
  )
  list;
}
```

### `@required`

Declares that the field is required upon instantiation. The validator runs at the end of object creation,
so the value can be provided by a subclass.

```js
import Component from '@ember/component';
import { argument, required } from '@ember-decorators/arguments';

export default class ExampleComponent extends Component {
  @required
  @argument
  arg;
}
```

```handlebars
{{example-component arg="value"}}

<!-- throws an error -->
{{example-component}}
```

### `@immutable`

Declares that the field is immutable. Validations begin after the object is created, so the value can be
changed or overridden by subclasses.

```js
import EmberObject from '@ember/object';
import { immutable } from '@ember-decorators/arguments';

class ExampleClass extends EmberObject {
  @immutable
  field = 'value';
}

let example = ExampleClasse.create();

example.set('field', 'bar'); // throws an error
```

## Installation

While `ember-decorators` is not a hard requirement to use this addon, it's recommended as it adds the
base class field and decorator babel transforms

```bash
ember install ember-decorators
ember install @ember-decorators/arguments
```

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
