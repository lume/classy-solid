# classy-solid

Tools for `class`-based reactivity powered by [Solid.js](https://solidjs.com),
and for using `class`es as Solid components (f.e. in a JSX template).

#### `npm install classy-solid --save`

# API and Usage

Note, these docs assume you have basic knowledge of [Solid.js](https://solidjs.com) first.

## `@reactive`

Mark a class with this decorator if it will have reactive properties (properties
backed by Solid signals). See `@signal` below for an example.

## `@signal`

Decorate a property of a class with `@signal` to make it reactive (backed by a
Solid signal). Be sure to decorate a class that has signal properties with the
`@reactive` decorator as well.

```js
import {reactive, signal} from 'classy-solid'
import {createEffect} from 'solid-js'

@reactive
class Car {
	@signal engineOn = false
	@signal sound = 'vroom'
}

const car = new Car()

createEffect(() => {
	// This re-runs any time car.engineOn or car.sound change.
	if (car.engineOn) console.log(car.sound)
})

// ...
```

## `@component`

A decorator that makes a `class` usable as a component within a Solid template
(f.e. within JSX markup).

A class decorated with `@component` can optionally have any three of the
following methods:

- `onMount` - Called after the the initial instantiation of the component, after
  the `template` has been executed, just like Solid's
  [`onMount`](https://www.solidjs.com/docs/latest/api#onmount).
- `onCleanup` - Called when the component is removed, just like Solid's
  [`onCleanup`](https://www.solidjs.com/docs/latest/api#oncleanup).
- `template` - Returns a template (f.e. JSX markup), just like the return values
  of a Solid function component, and it can use any reactive signal properties of
  the class.

> **Note** All props passed into a class component get mapped to class
> properties, regardless if the property is reactive or not. This means you can,
> for example, forgo the `@reactive` and `@signal` decorators and use your own
> accessors to handle changes in some other way.

Examples:

### JavaScript

#### With compiler support

Babel, for example, allows use of decorators and JSX:

```jsx
import {component, reactive, signal} from 'classy-solid'

@component
@reactive
class MyComp {
	@signal last = 'none'

	h1

	onMount() {
		console.log('h1 element:', this.h1)
	}

	onCleanup() {
		console.log('cleaned up')
	}

	template(props) {
		// Here we show that passed-in `props` can be used directly. All
		// props are automatically mapped to same-name properties on the
		// class instance, which is why the passed in `last={}` prop is
		// accessible as `this.last`.
		return (
			<h1 ref={this.h1}>
				Hello, my name is {props.first} {this.last}!
			</h1>
		)
	}
}

render(() => <MyComp first="Joe" last="Pea" />, document.body)
```

> **Note** You only need the `@reactive` decorator if you will use `@signal`
> properties in your class, regardless if your class is a component or not.

> **Warning** Make sure the `@component` decorator comes _before_ the
> `@reactive` decorator, or else a runtime error will let you know. :)

#### Without compiler support

> **Note** The new decorators proposal reached stage 3, so JavaScript will have
> decorators natively soon and won't require compiler support.

For plain JS users who don't have build setups yet , use the `component` and
`reactive` decorators as regular function calls, define a static
`signalProperties` array that lists any properties that should be reactive
(backed by Solid signals), and use Solid's [`html` template
tag](https://github.com/solidjs/solid/tree/main/packages/solid/html) for
templating:

```jsx
import {component, reactive} from 'classy-solid'
import html from 'solid-js/html'

const MyComp = component(
	reactive(
		class MyComp {
			static signalProperties = ['last']

			last = 'none'

			h1

			onMount() {
				console.log('h1 element:', this.h1)
			}

			onCleanup() {
				console.log('cleaned up')
			}

			template(props) {
				return html`<h1 ref=${el => (this.h1 = el)}>Hello, my name is ${() => props.first} ${() => this.last}!</h1>`
			}
		},
	),
)

render(() => html`<${MyComp} first="Joe" last="Pea" />`, document.body)
```

For reference, here's the same example, using only the `component` decorator,
but with custom properties that wire up Solid signals manually, which is the
equivalent of what the `@reactive` and `@signal` decorators do under the hood:

```jsx
import {component} from 'classy-solid'
import {createSignal} from 'solid-js'
import html from 'solid-js/html'

const MyComp = component(
	class MyComp {
		#last = createSignal('none')

		get last() {
			// read from a Solid signal
			const [get] = this.#last
			return get()
		}
		set last(value) {
			// write to a Solid signal
			const [, set] = this.#last
			set(value)
		}

		h1

		onMount() {
			console.log('h1 element:', this.h1)
		}

		onCleanup() {
			console.log('cleaned up')
		}

		template(props) {
			return html`<h1 ref=${el => (this.h1 = el)}>Hello, my name is ${() => props.first} ${() => this.last}!</h1>`
		}
	},
)

render(() => html`<${MyComp} first="Joe" last="Pea" />`, document.body)
```

### TypeScript

If you're using TypeScript syntax, there's no reason not to use decorators and
JSX because TS has support for both.

> **Note** The same rules apply here as with decorators in the previous JavaScript section.

```tsx
import {component, reactive, signal, Props} from 'classy-solid'

@component
@reactive
class MyComp {
	// Define `PropTypes` on your class to define prop types for JSX. Note, this
	// property does not actually need to exist at runtime and is not used at
	// runtime, so here we use the `!` to tell TS not to worry about it being
	// `undefined`.
	PropTypes!: Props<this, 'last' | 'count' | 'first'>

	@signal last = 'name'
	@signal first = 'no'
	@signal count = 123

	// This property will not appear in the JSX prop types, because we did not
	// list it in the `PropTypes` definition.
	foo = 'blah'

	h1: HTMLHeadingElement | undefined = undefined

	onMount() {
		console.log('h1 element:', this.h1)
	}

	onCleanup() {
		console.log('cleaned up')
	}

	template(props: this['PropTypes']) {
		// Note, unlike the JS examples, we had to define a `first` property on
		// the class or else it would not have a type definition here within
		// `props` or in JSX that uses the component. Plain JS has no types, so
		// there is no concern with that in those cases.
		return (
			<h1 ref={this.h1}>
				Hello, my name is {props.first} {this.last}! The count is {this.count}.
			</h1>
		)
	}
}

render(() => <MyComp first="Joe" last="Pea" count={456} />, document.body)
```

## `createSignalObject()`

Returns a Solid signal in the form of an object with `.get` and `.set` methods,
instead of an array tuple.

```js
let count = createSignalObject(0) // count starts at 0
count.set(1) // set the value of count to 1
count.set(count.get() + 1) // add 1
let currentValue = count.get() // read the current value
```

In cases where decorators are not yet supported or undesired, using Solid's
`createSignal` directly as a `class` property is not so ideal:

```js
class Counter {
	count = createSignal(0)

	increment() {
		// These are not so readable:
		this.count[1](this.count[0]() + 1)
		// or
		this.count[1](c => c + 1)
	}
}
```

`createSignalObject` provides an alternative that is more usable as a `class`
property:

```js
class Counter {
	count = createSignalObject(0)

	increment() {
		// These are more readable:
		this.count.set(this.count.get() + 1)
		// or
		this.count.set(c => c + 1)
	}
}
```

## `createSignalFunction()`

Returns a Solid signal in the form of a single overloaded function for both
getting and setting the signal, instead of an array tuple. Call the function
with no arguments to get the signal value, and call it with an arg to set the
signal value.

```js
let count = createSignalFunction(0) // count starts at 0
count(1) // set the value of count to 1
count(count() + 1) // add 1
let currentValue = count() // read the current value
```

In cases where decorators are not yet supported or undesired, using Solid's
`createSignal` directly as a `class` property is not so ideal:

```js
class Counter {
	count = createSignal(0)

	increment() {
		// These are not so readable:
		this.count[1](this.count[0]() + 1)
		// or
		this.count[1](c => c + 1)
	}
}
```

`createSignalFunction` provides an alternative that is more usable as a `class`
property:

```js
class Counter {
	count = createSignalFunction(0)

	increment() {
		// These are more readable:
		this.count(this.count() + 1)
		// or
		this.count(c => c + 1)
	}
}
```

## `signalify()`

Use this to convert properties on an object into Solid signal-backed properties.

There are two ways to use this: either by defining which properties to convert
to signal-backed properties by providing an array as property names in the
second arg, which is useful on plain objects, or by passing in `this` and
`this.constructor` within the `constructor` of a class that has reactive
properties listed in a static `signalProperties` array (this is what the
@reactive and @signal decorators end up doing behind the scenes).

This can be useful with plain objects, as well with `class`es in situations
where decorators are unavailable or undesired.

In some cases, using `signalify` is more desirable than Solid's `createMutable`
because the original object will be in use, rather than a `Proxy`. This can be
useful, for example, for patching 3rd-party objects to make them reactive,
whereas it would not be possible with `createMutable`.

Here are some examples. Make certain properties on an object reactive
signal-backed properties:

```js
import {signalify} from 'class-solid'
import {createEffect} from 'solid-js'

const obj = {
	foo: 1,
	bar: 2,
	baz: 3,
}

// Make only the 'foo' and 'bar' properties reactive (backed by Solid signals).
signalify(obj, ['foo', 'bar'])

// ...

createEffect(() => {
	console.log(obj.foo, obj.bar)
})
```

Note, it returns the same object passed in, so you can write this:

```js
const obj = signalify(
	{
		foo: 1,
		bar: 2,
		baz: 3,
	},
	// Make only the 'foo' and 'bar' properties reactive (backed by Solid signals).
	['foo', 'bar'],
)
```

If you want to make all properties signal-backed, then omitting the array will internally use `Object.keys(obj)` as a default:

```js
// Make all properties reactive signals
const obj = signalify({
	foo: 1,
	bar: 2,
	baz: 3,
})
```

Note that the object passed in is the same object returned:

```js
let test
const obj = signalify(test = {...})
console.log(obj === test) // true
```

Signalify certain properties in a class (alternative to decorators):

```js
import {signalify} from 'class-solid'
import {createEffect} from 'solid-js'

class Counter {
	count = 0
	on = true

	constructor() {
		// Make only the 'count' variable reactive (signal-backed). The 'on'
		// variable remains a regular property.
		signalify(this, ['count'])
	}
}

const c = new Counter()

// ...

createEffect(() => {
	console.log(c.count)
})
```

The downside of the previous example (namely, not using decorators) is that the
code is less [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself), we
had to repeat ourselves by writing the word "count" twice. But, if you're okay
with it, you can make all properties reactive by omitting the second arg
(sometimes you don't want all properties to be reactive):

```js
class Counter {
	count = 0
	on = true

	constructor() {
		// Both 'count' and 'on' will be signal-backed:
		signalify(this)
	}
}
```

Another way to describe which properties are reactive is with a static
`signalProperties` array and passing the constructor to `signalify`, which is
exactly what the decorators are syntax sugar for:

```js
class Counter {
	count = 0
	on = true

	static signalProperties = ['count']

	constructor() {
		// Only 'count' will be signal-backed:
		signalify(this, this.constructor)
	}
}
```

Note how with decorators, the code is more DRY and concise, because we don't have to repeat
the `count` word twice, therefore reducing some surface area for human mistakes,
and we don't have to write a `constructor`:

```js
@reactive
class Counter {
	@signal count = 0
	on = true
}
```
