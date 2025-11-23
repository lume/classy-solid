# <img src="./logo/Favicon_Classy.svg" height="32" /> Classy Solid <!-- omit in toc -->

Utilities for making `class`es reactive with [Solid.js](https://solidjs.com)
signals, and for using `class`es as Solid.js components.

![](https://github.com/user-attachments/assets/f091e629-7752-4a1a-808c-8672c1da072c)

# Table of Contents <!-- omit in toc -->

- [At a glance](#at-a-glance)
- [Install](#install) - [`npm install classy-solid`](#npm-install-classy-solid)
  - [Vite Setup](#vite-setup)
  - [Babel Setup](#babel-setup)
- [API and Usage](#api-and-usage)
  - [Decorator APIs](#decorator-apis)
    - [`@reactive`](#reactive)
    - [`@signal`](#signal)
    - [`@memo`](#memo)
    - [`@component`](#component)
      - [JavaScript with build tools](#javascript-with-build-tools)
      - [JavaScript without build tools](#javascript-without-build-tools)
      - [TypeScript](#typescript)
  - [Non-decorator APIs](#non-decorator-apis)
    - [`component()`](#component-1)
    - [`createSignalObject()`](#createsignalobject)
    - [`createSignalFunction()`](#createsignalfunction)
    - [`signalify()`](#signalify)
    - [`memoify()`](#memoify)
    - [`Effectful`](#effectful)
    - [`Effects`](#effects)
    - [`syncSignals`](#syncsignals)
    - [`createSyncedSignals`](#createsyncedsignals)
    - [`createStoppableEffect`](#createstoppableeffect)

# At a glance

```jsx
import {createEffect, render, batch} from 'solid-js'
import {component, signal, memo} from 'classy-solid'

//////////////////////////////////////////////////
// Make plain classes reactive with Solid signals.

class Counter {
	@signal count = 0
	@signal num = 10

	@memo get sum() {
		return this.count + this.num
	}

	increment() {
		this.count++
	}
}

const counter = new Counter()

setInterval(() => counter.increment(), 1000)

createEffect(() => {
	// Log the count whenever it changes.
	console.log(`Count is: ${counter.count}`)
})

createEffect(() => {
	// Log the sum whenever it changes.
	console.log(`Sum is: ${counter.sum}`)
})

counter.count = 5 // Logs "Count is: 5" and "Sum is: 15"
counter.num = 20 // Logs "Sum is: 25"

// After the batch function runs, logs "Count is: 10", but does not log "Sum is:
// 25" because the sum did not change (@memo prevents effects from running
// unnecessarily on the same values).
batch(() => {
	counter.count = 10
	counter.num = 15
})

//////////////////////////////////////////////////
// Optionally use classes as Solid components.

@component
class MyComp {
	@signal message = 'Hello, World!'

	template(props) {
		setTimeout(() => {
			this.message = 'Hello after 3 seconds!'
		}, 3000)

		return (
			<div>
				<h1>{this.message}</h1>

				<p>My name is {props.name}.</p>

				<p>The count is: {counter.count}</p>
			</div>
		)
	}
}

render(() => <MyComp name="Joe" />, document.body)
```

# Install

#### `npm install classy-solid`

> **Note** If you do not have or do not wish to use a build tool, see the
> [Without compiler support](#without-compiler-support) section for plain
> JavaScript usage without decorators.

> **Note** `classy-solid` works only with the latest stage-3 decorators. Legacy
> decorators are no longer supported, as we've moved onto the official decorator
> format finally blessed by the TC39 EcmasScript language design committee.

## Vite Setup

Using `classy-solid` with Vite may result in the following error because
decorators are not yet released natively into JavaScript engines (but they will
be soon!). For now, a Babel configuration must be provided to compile the syntax
for decorators.

```
Support for the experimental syntax 'decorators' isn't currently enabled
```

To use `classy-solid` with Vite (or [Solid Start](https://start.solidjs.com/getting-started/what-is-solidstart)), we need to set up the Babel configuration for
the Solid.js Vite plugin. First run the following:

```
npm install --save-dev @babel/plugin-proposal-decorators
```

Then update your `vite.config.js` to use the Babel plugin:

```js
// ...
solidPlugin({
	babel: {
		plugins: [['@babel/plugin-proposal-decorators', {version: '2022-03'}]],
	},
})
// ...
```

## Babel Setup

Similar to the Vite Setup above, you'll specify in your
[Babel config file](https://babeljs.io/docs/en/configuration)
the same `@babel/plugin-proposal-decorators` plugin.

```js
// ...
plugins: [['@babel/plugin-proposal-decorators', {version: '2022-03'}]]
// ...
```

# API and Usage

Note, these docs assume you have basic knowledge of [Solid.js](https://solidjs.com) first.

## Decorator APIs

### `@reactive`

Mark a class with this decorator if it will have signal properties (properties
backed by Solid signals). See `@signal` below for an example.

### `@signal`

Decorate a property of a class with `@signal` to make it reactive (backed by a
Solid signal). Be sure to decorate a class that has signal properties with the
`@reactive` decorator as well.

```js
import {reactive, signal} from 'classy-solid'
import {createEffect} from 'solid-js'

export
@reactive
class Car {
	@signal engineOn = false
	@signal sound = 'vroom'
}
```

```js
import {Car} from './Car'

const car = new Car()

createEffect(() => {
	// This re-runs any time car.engineOn or car.sound change.
	if (car.engineOn) console.log(car.sound)
})

// ...
```

### `@memo`

Create a memoized derived value (readonly or writable) whose computation is
cached and only re-runs when one of its reactive dependencies (usually
`@signal` / `signalify` properties) changes AND the computed value actually
changes. This prevents unnecessary effect executions when dependencies change
but the derived result stays the same.

Memos properties internally use Solid's `createMemo`/`createWritableMemo`.

Supported member forms:

| Form                        | Example                                                 | Call Style                | Writable? | Rule                                   |
| --------------------------- | ------------------------------------------------------- | ------------------------- | --------- | -------------------------------------- |
| Field (arrow fn)            | `@memo sum = () => this.a + this.b`                     | `ex.sum()`                | No        | Function arity 0 => readonly           |
| Field (arrow fn with param) | `@memo sum = (_v?: number) => this.a + this.b`          | `ex.sum()` / `ex.sum(20)` | Yes       | Arity > 0 => writable                  |
| Getter                      | `@memo get sum() { return this.a + this.b }`            | `ex.sum`                  | No        | Getter w/o matching setter => readonly |
| Getter + Setter             | `@memo get sum() { ... }` & `@memo set sum(v) {}`       | `ex.sum` / `ex.sum = 20`  | Yes       | Getter + (empty) setter => writable    |
| Accessor (auto) readonly    | `@memo accessor sum = () => this.a + this.b`            | `ex.sum()`                | No        | Arrow fn arity 0 => readonly           |
| Accessor (auto) writable    | `@memo accessor sum = (_v?: number) => this.a + this.b` | `ex.sum()` / `ex.sum(20)` | Yes       | Arrow fn arity > 0 => writable         |
| Method readonly             | `@memo sum() { return this.a + this.b }`                | `ex.sum()`                | No        | Method arity 0 => readonly             |
| Method writable             | `@memo sum(_v?: number) { return this.a + this.b }`     | `ex.sum()` / `ex.sum(20)` | Yes       | Method arity > 0 => writable           |

Writable memos: Setting a writable memo (e.g. `ex.sum(20)` or `ex.sum = 20`)
overrides the current derived value. Subsequent dependency changes resume normal
recomputation. Readonly memos throw if you attempt to set them.

Arity rules: A function (field, accessor, or method) with length 0 becomes a
readonly memo. A function with length > 0 becomes writable. For getter/setter
pairs, the presence of an empty setter marks the memo writable. Note, do not
provide a non-empty setter, it is ignored.

Example:

```ts
class Counter {
	@signal a = 1
	@signal b = 2

	// readonly getter memo
	@memo get sum() {
		return this.a + this.b
	}

	// writable method memo
	@memo diff(_override?: number) {
		return this.a - this.b
	}
}

const c = new Counter()
createEffect(() => console.log('sum:', c.sum)) // logs only on value change
createEffect(() => console.log('diff:', c.diff()))

c.a = 5 // sum recomputes (7), diff recomputes (3)
c.diff(100) // override writable memo (diff now 100)
c.a = 6 // diff recomputes again (6 - 2 = 4)
```

In JS without decorators, use `signalify()` + `memoify()` manually:

```js
class Counter {
	a = 1
	b = 2

	get sum() {
		return this.a + this.b
	}

	diff = () => this.a - this.b

	constructor() {
		signalify(this, 'a', 'b')
		memoify(this, 'sum', 'diff')
	}
}

const c = new Counter()

// ... same usage as above ...
```

Gotchas:

- Methods and fields that become memo functions need to be invoked (`ex.sum()`), whereas getters are accessed as values (`ex.sum`).
- Readonly memos should not be assigned; doing so throws.

### `@component`

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
> accessors to handle changes in some other way as you wish, or use existing
> classes that have properties implemented in their own way.

Examples:

#### JavaScript with build tools

Currently the best way to write JavaScript code with `classy-solid` is if you have a
build setup in place (soon decorators will be native in JavaScript engines and a
build step will not be necessary for decorators, but will still be necessary for
JSX templates).

The [Babel](https://babeljs.io/) compiler, for example, allows use of decorators and JSX:

```jsx
import {component, reactive, signal} from 'classy-solid'
import {onMount, onCleanup, createEffect} from 'solid-js'

export
@component
@reactive
class MyComp {
	@signal last = 'none'
	@signal count = 1

	h1

	onMount() {
		console.log('h1 element reference:', this.h1)

		this.int = setInterval(() => this.count++, 1000)

		// Clean up like this,
		onCleanup(() => clearInterval(this.int))
	}

	// or clean up like this.
	onCleanup() {
		clearInterval(this.int)
	}

	template(props) {
		// The class is in a Solid reactive context. You can also use onMount or
		// other Solid APIs like usual. The template() method is a Solid
		// function component that has access to `this`. For example, the
		// following two lines of standard Solid code would work fine here:
		onMount(() => console.log('mounted'))
		createEffect(() => console.log('count:', this.count))

		// Here we show that passed-in `props` can be used directly. All
		// props are automatically mapped to same-name properties on the
		// class instance, which is why the passed in `last={}` prop is
		// accessible as `this.last`.
		return (
			<h1 ref={this.h1}>
				Hello, my name is {props.first} {this.last}! The count is {this.count}.
			</h1>
		)
	}
}

render(() => <MyComp first="Joe" last="Pea" />, document.body)
```

> **Note** You only need the `@reactive` decorator if you will use `@signal`
> properties in your class, regardless if your class is a component or not.

#### JavaScript without build tools

> **Note** The new decorators proposal reached stage 3, so JavaScript will have
> decorators natively soon and won't require compiler support.

For plain JS users without build setups, use `component` and `signalify` with
normal function calls, and use Solid's [`html` template
tag](https://github.com/solidjs/solid/tree/main/packages/solid/html) for
templating:

```jsx
import {component, signalify} from 'classy-solid'
import html from 'solid-js/html'

const MyComp = component(
	class MyComp {
		last = 'none'
		count = 1

		h1

		constructor() {
			signalify(this, 'last', 'count')
			// Or, to signalify all properties (except any with function values):
			// signalify(this)
		}

		onMount() {
			console.log('h1 element:', this.h1)

			this.int = setInterval(() => this.count++, 1000)

			// Clean up like this,
			onCleanup(() => clearInterval(this.int))
		}

		// or clean up like this.
		onCleanup() {
			clearInterval(this.int)
		}

		template(props) {
			onMount(() => console.log('mounted'))
			createEffect(() => console.log('count:', this.count))

			return html`<h1 ref=${el => (this.h1 = el)}>Hello, my name is ${() => props.first} ${() => this.last}!</h1>`
		}
	},
)

render(() => html`<${MyComp} first="Joe" last="Pea" />`, document.body)
```

For reference, here's the same example using the `component` decorator as a
regular function, but with accessor properties that wire up Solid signals
manually, which is essentially the equivalent of what the `@reactive` and `@signal`
decorators do under the hood for convenience:

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

		#count = createSignal(1)

		get count() {
			const [get] = this.#count
			return get()
		}
		set count(value) {
			const [, set] = this.#count
			set(value)
		}

		h1

		onMount() {
			console.log('h1 element:', this.h1)

			this.int = setInterval(() => this.count++, 1000)

			// Clean up like this,
			onCleanup(() => clearInterval(this.int))
		}

		// or clean up like this.
		onCleanup() {
			clearInterval(this.int)
		}

		template(props) {
			onMount(() => console.log('mounted'))
			createEffect(() => console.log('count:', this.count))

			return html`<h1 ref=${el => (this.h1 = el)}>Hello, my name is ${() => props.first} ${() => this.last}!</h1>`
		}
	},
)

render(() => html`<${MyComp} first="Joe" last="Pea" />`, document.body)
```

#### TypeScript

TypeScript supports decorators out of the box with no additional setup needed.

> **Note** The same rules apply here as with decorators in the previous
> JavaScript section, and the only difference here is added type checking.

```tsx
import {component, reactive, signal, Props} from 'classy-solid'

@component
@reactive
class MyComp {
	// Define `PropTypes` on your class to define prop types for JSX. Note, this
	// property does not actually need to exist at runtime and is not used at
	// runtime, so here we use the `declare` to tell TS not to assume it exists
	// for the sake of type checking.
	// Do not try to use this property at runtime!
	declare PropTypes: Props<this, 'last' | 'count' | 'first'>

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

## Non-decorator APIs

### `component()`

The [component](#component) decorator is also available as a regular function
for use in situations where decorators are undesired not yet supported. See the
[JavaScript without build tools](#javascript-without-build-tools) section above
for an example.

### `createSignalObject()`

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

### `createSignalFunction()`

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

### `signalify()`

Use this to convert properties on an object into Solid signal-backed properties.
This is what `@signal` uses behind the scenes.

This can be useful with plain objects, as well with `class`es in situations
where decorators are unavailable or undesired.

Here are some examples. Make certain properties on an object reactive
signal-backed properties:

```js
import {signalify} from 'class-solid'
import {createEffect} from 'solid-js'

const obj = {foo: 1, bar: 2, baz: 3}

// Make only the 'foo' and 'bar' properties reactive (backed by Solid signals).
signalify(obj, 'foo', 'bar')

// ...

createEffect(() => {
	console.log(obj.foo, obj.bar)
})
```

In some cases, using `signalify` is more desirable than Solid's `createMutable`
because the original object is not wrapped in a `Proxy`. This can be useful for
patching 3rd-party objects to make them reactive, whereas it would not be
possible with `createMutable`.

Note, it returns the same object passed in, so you can write this:

```js
// Make only the 'foo' and 'bar' properties reactive (backed by Solid signals).
const obj = signalify({foo: 1, bar: 2, baz: 3}, 'foo', 'bar')
```

If you want to make all properties signal-backed, then omitting the property
names in the call will internally use `Object.keys(obj)` as a default:

```js
// Make all properties reactive signals (except any with function values).
const obj = signalify({foo: 1, bar: 2, baz: 3, method() {}})
```

Note that the object passed in is the same object returned:

```js
let test
const obj = signalify(test = {...})
console.log(obj === test) // true
```

To include function valued properties, explicitly list them in the call:

```js
const obj = signalify({foo: 1, bar: 2, baz: 3, method() {}}) // signalifies foo, bar, baz only
signalify(obj, 'method') // now method is also signalified
```

We exclude methods by default because those are handled by default by `memoify()`.

Signalify properties in a class (alternative to decorators):

```js
import {signalify} from 'class-solid'
import {createEffect} from 'solid-js'

class Counter {
	count = 0
	on = true

	constructor() {
		// Make only the 'count' variable reactive (signal-backed). The 'on'
		// variable remains a regular property.
		signalify(this, 'count')
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

	method() {}

	constructor() {
		// Both 'count' and 'on' will be signal-backed (method won't be):
		signalify(this)
	}
}
```

Note how with decorators, the code is more DRY and concise, because we don't
have to express the property names more than once, therefore reducing some surface
area for human mistakes, and we don't have to write a `constructor`:

```js
@reactive
class Counter {
	@signal count = 0
	@signal on = true

	method() {}
}
```

### `memoify()`

Convert function-valued properties or accessors on an object or instance into
Solid memo-backed descriptors, enabling reactive derived computations without
decorators. Similar to [`signalify()`](#signalify) for signals.

Signature:

```ts
memoify(obj: object, ...props: (keyof typeof obj)[]): typeof obj
// Automatic mode (no props): memoify all function-valued own keys & accessors.
```

Behavior:

- Explicit mode (`memoify(obj, 'foo', 'bar')`): Only listed keys memoified.
- Automatic mode (`memoify(obj)`): All own string & symbol keys; skips non-function values unless they are accessors (getter/setter).
- Function arity 0 => readonly memo (`ex.sum()`).
- Function arity > 0 => writable memo (`ex.sum()` and `ex.sum(20)`).
- Getter only => readonly memo.
- Getter + setter => writable memo (setter should be empty, it is symbolic only).
- Already memoified or signalified getters are skipped.

Examples:

```js
const obj = {
	a: 1,
	b: 2,

	// readonly memo via method
	sum() {
		return this.a + this.b
	},

	// Writable memo via accessor
	get diff() {
		return this.a - this.b
	},
	set diff(v) {}, // Setter makes the memo writable
}

signalify(obj, 'a', 'b')
memoify(obj, 'sum', 'diff')

createEffect(() => console.log('sum:', obj.sum()))
createEffect(() => console.log('diff:', obj.diff))

obj.a = 5 // triggers both memos (sum=7, diff=3)
obj.diff = 100 // overrides diff
obj.a = 6 // diff recomputes (6 - 2 = 4)
```

Automatic mode:

```js
const calc = {
	x: 10,
	y: 5,

	product() {
		return this.x * this.y
	},

	get ratio() {
		return this.x / this.y
	},
}

signalify(calc) // make x, y reactive
memoify(calc) // memoify product(), ratio
```

Use cases:

- Plain objects needing derived reactive values without decorators.
- ES5-style constructor/prototype patterns.
- Memoizing expensive calculations (chained memos supported).

When to prefer `@memo` vs `memoify()`:

- Use `@memo` inside modern class syntax where decorators are supported.
- Use `memoify()` for plain objects, prototypes, or when decorators are undesirable or not available.

### `Effectful`

`Effectful` is a class-factory mixin that gives your class a `createEffect()`
method, along with a `stopEffects()` method that will stop all current effects.

Here's an example that shows a custom element that starts effects on connected,
and cleans them up on disconnect:

```js
import {reactive, signal, Effectful} from 'classy-solid'

@reactive
class CounterDisplay extends Effectful(HTMLElement) {
	@signal count

	get double() {
		return this.count * 2
	}

	constructor() {
		super()
		this.attachShadow({mode: 'open'})
		this.shadowRoot.innerHTML = `<div></div>`
	}

	connectedCallback() {
		// Create some effects
		this.createEffect(() => {
			this.shadowRoot.firstElementChild.textContent = `Count is: ${this.count}`
		})

		this.createEffect(() => {
			console.log('count:', this.count)
		})

		this.createEffect(() => {
			console.log('double:', this.double)
		})
	}

	disconnectedCallback() {
		// Stop the effects
		this.stopEffects()
	}
}

customElements.define('counter-display', CounterDisplay)
```

`createEffect()` creates a single owner root for all effects for the current
instance, unless it is called inside another root in which case it'll use that
root.

### `Effects`

An instantiation of `Effectful(Object)` as a shortcut.

Useful when not extending from a mixin:

```js
class MyClass extends Effects {
    constructor() {
        this.createEffect(() => {...})
        this.createEffect(() => {...})
    }

    dispose() {
        this.stopEffects()
    }
}

const o = new MyClass()

// ...later, when finished...
o.dispose()
```

Useful when separate groups of effects are needed where each group can be stopped indepently of others.

```js
class MyClass {
    specialEffects = new Effects()
    otherEffects = new Effects()

    doSpecialStuff() {
        this.specialEffects.createEffect(() => {...})
        this.specialEffects.createEffect(() => {...})
    }

    cleanupSpecialStuff() {
        this.specialEffects.stopEffects()
    }

    doOtherStuff() {
        this.otherEffects.createEffect(() => {...})
        this.otherEffects.createEffect(() => {...})
    }

    cleanupOtherStuff() {
        this.otherEffects.stopEffects()
    }
}
```

### `syncSignals`

Syncs two signals together so that setting one signal's value updates the
other, and vice versa, without an infinite loop.

Example:

```js
const [foo, setFoo] = createSignal(0)
const [bar, setBar] = createSignal(0)

syncSignals(foo, setFoo, bar, setBar)

createEffect(() => console.log(foo(), bar()))

setFoo(1) // logs "1 1"
setBar(2) // logs "2 2"
```

It returns the getters/setters, so it is possible to also create the signals
and sync them at once:

```js
const [[foo, setFoo], [bar, setBar]] = syncSignals(...createSignal(0), ...createSignal(0))

createEffect(() => console.log(foo(), bar()))

setFoo(1) // logs "1 1"
setBar(2) // logs "2 2"
```

### `createSyncedSignals`

Useful as a shorthand for:

```js
const [[foo, setFoo], [bar, setBar]] = syncSignals(...createSignal(0), ...createSignal(0))
```

Example:

```js
const [[foo, setFoo], [bar, setBar]] = createSyncedSignals(0)
```

### `createStoppableEffect`

NOTE: Experimental

Create a stoppable effect.

```js
const effect = createStoppableEffect(() => {
	// ...
})

// ...later, stop the effect from running again.
effect.stop()
```

Note, this is experimental because when inside of a parent reactive context
that is long-lived (f.e. for life time of the app), each new effect created
with this and subsequently stopped will stick around and not be GC'd until
the parent context is cleaned up (which could be never).

Stopped effects will currently only be GC'd freely when they are created
outside of a reactive context.
