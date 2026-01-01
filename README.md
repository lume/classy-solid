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
    - [`@signal`](#signal)
    - [`@memo`](#memo)
    - [`@effect`](#effect)
    - [`@untracked`](#untracked)
    - [`@component`](#component)
      - [JavaScript with build tools](#javascript-with-build-tools)
      - [JavaScript without build tools](#javascript-without-build-tools)
      - [Accessing the class instance with `ref`:](#accessing-the-class-instance-with-ref)
      - [TypeScript definition](#typescript-definition)
      - [Type-safe refs in TypeScript:](#type-safe-refs-in-typescript)
    - [`@reactive` (deprecated)](#reactive-deprecated)
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
  - [Error Handling and Caveats](#error-handling-and-caveats)
    - [Writable Memo Overrides](#writable-memo-overrides)
    - [Static Fields](#static-fields)
    - [Memory Considerations](#memory-considerations)

# At a glance

```jsx
import {render, batch} from 'solid-js'
import {component, signal, memo, effect, stopEffects} from 'classy-solid'

//////////////////////////////////////////////////
// Make plain classes reactive with Solid signals.

class Counter {
	@signal count = 0
	@signal num = 10

	@memo get #sum() {
		return this.count + this.num
	}

	@effect #logCount() {
		// Log the count whenever it changes.
		console.log(`Count is: ${this.count}`)
	}

	@effect #logSum() {
		// Log the sum whenever it changes.
		console.log(`Sum is: ${this.#sum}`)
	}

	increment() {
		this.count++
	}
}

const counter = new Counter()

setInterval(() => counter.increment(), 1000)

counter.count = 5 // Logs "Count is: 5" and "Sum is: 15"
counter.num = 20 // Logs "Sum is: 25"

// After the batch function runs, logs "Count is: 10", but does not log "Sum is:
// 25" because the sum did not change (@memo prevents effects from running
// unnecessarily on the same values).
batch(() => {
	counter.count = 10
	counter.num = 15
})

// ...later, clean up when done...
stopEffects(counter)

//////////////////////////////////////////////////
// Optionally use classes as Solid components.

@component
class MyComp {
	@signal message = 'Hello, World!'
	@signal name = 'Asa'

	template() {
		setTimeout(() => (this.message = 'Hello after 3 seconds!'), 3000)

		return (
			<div>
				<h1>{this.message}</h1>

				<p>My name is {this.name}.</p>

				<p>The count is: {counter.count}</p>
			</div>
		)
	}
}

render(() => <MyComp name="Joe" />, document.body)
```

See the [live example](https://rawcdn.githack.com/lume/classy-solid/84a66ba70924f7a534792910aaeace3f594ff1db/example/index.html) and its [source code](https://github.com/lume/classy-solid/blob/84a66ba70924f7a534792910aaeace3f594ff1db/src/example.ts).

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

### `@signal`

Decorate a property (field, getter/setter, or auto accessor) of a class with
`@signal` to make it reactive (i.e. backed by a Solid signal).

```js
import {signal} from 'classy-solid'
import {createEffect} from 'solid-js'

export class Car {
	// field
	@signal engineOn = false

	// auto accessor
	@signal accessor sound = 'vroom'

	#speed = 0

	// getter/setter
	@signal get speed() {
		return this.#speed
	}
	@signal set speed(value) {
		this.#speed = value
	}

	// Alternatively, put the signal on the private field, depending on your
	// needs:
	// @signal #speed = 0
	// get speed() {
	// 	return this.#speed
	// }
	// set speed(value) {
	// 	this.#speed = value
	// }
}
```

```js
import {Car} from './Car'

const car = new Car()

createEffect(() => {
	// This re-runs any time car.engineOn or car.sound change.
	if (car.engineOn) console.log(car.sound, 'at speed', car.speed)
	else console.log('engine off')
})

// ...
```

### `@memo`

Use this on a class property (getter/setter, auto accessor, or method) to create
a memoized derived value (readonly or writable) whose computation is cached and
only triggers effects when one of its reactive dependencies (f.e. `@signal` / `signalify`
properties) changes AND the computed value actually changes. This prevents
unnecessary effect executions when dependencies change but the derived result
stays the same.

Always prefer memos over effects for derived values, even if the value always
changes, as it is more semantic to express derived values as memos.

Memo properties internally use Solid's `createMemo`/`createWritableMemo`
depending on the member form and function arity.

Supported member forms:

| Form                     | Example                                                 | Call Style                | Writable? | Rule                                   |
| ------------------------ | ------------------------------------------------------- | ------------------------- | --------- | -------------------------------------- |
| Getter                   | `@memo get sum() { return this.a + this.b }`            | `ex.sum`                  | No        | Getter w/o matching setter => readonly |
| Getter + Setter          | `@memo get sum() { ... }` & `@memo set sum(v) {}`       | `ex.sum` / `ex.sum = 20`  | Yes       | Getter + (empty) setter => writable    |
| Accessor (auto) readonly | `@memo accessor sum = () => this.a + this.b`            | `ex.sum()`                | No        | Arrow fn arity 0 => readonly           |
| Accessor (auto) writable | `@memo accessor sum = (_v?: number) => this.a + this.b` | `ex.sum()` / `ex.sum(20)` | Yes       | Arrow fn arity > 0 => writable         |
| Method readonly          | `@memo sum() { return this.a + this.b }`                | `ex.sum()`                | No        | Method arity 0 => readonly             |
| Method writable          | `@memo sum(_v?: number) { return this.a + this.b }`     | `ex.sum()` / `ex.sum(20)` | Yes       | Method arity > 0 => writable           |

All forms work with public or private (`#private`) members.

Writable memos: Setting a writable memo (e.g. `ex.sum(20)` or `ex.sum = 20`)
overrides the current derived value. Subsequent dependency changes resume normal
recomputation. Readonly memos throw if you attempt to set them.

Arity rules: A function value (for auto accessors or methods) with length 0
becomes a readonly memo. A function value with length > 0 becomes writable. For
getter/setter pairs, the presence of an empty setter marks the memo writable.
Note, do not provide a non-empty setter, it is ignored.

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

- Methods and fields that become memo functions need to be invoked (`ex.sum()`),
  whereas getters are accessed via property access (`ex.sum`).
- Readonly memos should not be assigned; doing so throws.

### `@effect`

Decorate a method or auto accessor (with a function value) with `@effect` to
automatically create a Solid.js effect for it. The effect runs during
instantiation and re-runs whenever any reactive dependencies (signals or memos)
accessed within it change.

**Purpose:** Simplifies reactive side effects by eliminating the need to
manually call `createEffect()` in constructors or methods. Pair with `@signal`
and `@memo` to create reactive classes with minimal boilerplate.

**Use cases:**

- Logging or debugging reactive state changes.
- Side effects like network requests, DOM manipulation, or event subscriptions.

**Cleanup:** Effects are tied to the class instance. Use:

- `stopEffects(instance)` - standalone function to dispose all effects on an instance.
- `instance.stopEffects()` - when extending `Effectful(BaseClass)` or `Effects`.

If the instance is created within an existing Solid owner (root, component,
effect), effects are disposed automatically when that owner cleans up, and
`stopEffects()` calls are unnecessary and will be a no-op.

**Restart effects:** If you've stopped effects on an instance and want to restart
them, use:

- `startEffects(instance)` - standalone function to restart all effects on an instance.
- `instance.startEffects()` - when extending `Effectful(BaseClass)` or `Effects`.

**Supported forms:**

- **Method** (recommended): `@effect methodName() { ... }`
- **Auto accessor**: `@effect accessor name = () => { ... }`

Both forms work with public or private (`#private`) members. Private effects are
recommended, as people typically shouldn't rely on calling public methods to
trigger logic that should already be automatic.

**Example with `stopEffects()` and `startEffects()`:**

```ts
import {effect, signal, stopEffects, startEffects} from 'classy-solid'
import {createSignal} from 'solid-js'

const [a, setA] = createSignal(1)

class Counter {
	@signal count = 0

	// Method form (recommended)
	@effect #logSum() {
		console.log('Sum:', a() + this.count)
	}

	// Auto accessor form (not recommended, only to keep any possibly pre-existing code as-is)
	@effect accessor #logCount = () => {
		console.log('Count:', this.count)
	}
}

const counter = new Counter() // logs "Sum: 1", "Count: 0"

setA(5) // logs "Sum: 5"
counter.count = 10 // logs "Sum: 15", "Count: 10"

// Later, clean up when done
stopEffects(counter)

setA(8) // does not log anything
counter.count = 20 // does not log anything

// Later, restart effects
startEffects(counter) // logs "Sum: 28", "Count: 20"

setA(2) // logs "Sum: 22"
```

**Example with [`Effectful`](#effectful) / [`Effects`](#effects) mixin:**

```ts
import {effect, signal, memo, Effects} from 'classy-solid'
import {createSignal} from 'solid-js'

const [a, setA] = createSignal(1)

// Extending from the Effectful(), or the non-mixin shortcut Effects class, give
// us the stopEffects method. In this case, use `obj.stopEffects()` instead of
// `stopEffects(obj)`.
class Counter extends Effects {
	@signal count = 0

	// Example: this memo is private, used only within the class.
	@memo get #sum() {
		return a() + this.count
	}

	// Example: this effect is private, used only within the class.
	@effect #logSum() {
		console.log('Sum:', this.#sum)
	}
}

const counter = new Counter() // logs "Sum: 1"

setA(5) // logs "Sum: 5"
counter.count = 10 // logs "Sum: 15"

batch(() => {
	counter.count = 7
	setA(8)
}) // Does not log anything because sum did not change.

// Later, clean up when done
counter.stopEffects()

setA(2) // does not log anything
counter.count = 20 // does not log anything

// Later, restart effects
counter.startEffects() // logs "Sum: 22"

setA(3) // logs "Sum: 23"
```

**Why `@effect` over manual `createEffect()`?**

- Less boilerplate (no constructor needed).
- Declarative: effects defined inline with the properties they affect.
- Automatic lifecycle management when used with `Effectful` or `Effects`.

Without decorators:

```js
import {signalify, Effects} from 'classy-solid'
import {createSignal} from 'solid-js'

const [a, setA] = createSignal(1)

class Counter extends Effects {
	count = 0

	get sum() {
		return a() + this.count
	}

	logSum() {
		console.log('Sum:', this.sum)
	}

	constructor() {
		signalify(this, 'count')
		memoify(this, 'sum')
		this.createEffect(this.logSum.bind(this))
	}
}

const counter = new Counter()
counter.stopEffects() // when done
```

**Integrate with classess that have life cycle methods:**

For example, with Custom Element classes:

```js
import {effect, signal, startEffects, stopEffects} from 'classy-solid'
import {externalState} from './hypothetical-app-state.js'

class MyElement extends HTMLElement {
	@effect #logCount() {
		console.log('Value is now:', externalState.value)
	}

	connectedCallback() {
		// Start effects when element is added (or re-added) to DOM.
		startEffects(this)
	}

	disconnectedCallback() {
		// Stop effects when element is removed from DOM (if the element will not be
		// used again and is unreferenced, effects are garbage collected).
		stopEffects(this)
	}
}

customElements.define('my-element', MyElement)
```

### `@untracked`

A class decorator that makes a class's constructor untracked, preventing signal
reads during construction from being tracked by outer effects.

**When to use:** Only needed if your constructor reads signal/memo values.
Without `@untracked`, such a constructor will track dependencies when it is
instantiated in an effect and will cause an infinite loop.

Example:

```js
import {untracked, signal} from 'classy-solid'
import {createEffect} from 'solid-js'

@untracked
class Example {
	@signal count = 0

	constructor() {
		// Reading this.count here won't be tracked by outer effects
		this.count = this.count + 1
	}
}

createEffect(() => {
	// This effect won't track count reads in the constructor,
	// preventing infinite loops. It only runs once.
	const example = new Example()

	createEffect(() => {
		// This inner effect DOES track count changes
		console.log(example.count)
	})
})
```

Without decorators:

```js
import {untracked} from 'classy-solid'

const Example = untracked(
	class {
		count = 0

		constructor() {
			signalify(this)
			// Reading this.count here won't be tracked by outer effects
			this.count = this.count + 1
		}
	},
)

// ... same usage as above ...
```

### `@component`

A decorator that makes a `class` usable as a component within a Solid template
(f.e. within JSX, or an `html` template tag).

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
> for example, forgo the `@signal` decorator and use your own accessors to
> handle changes in some other way as you wish, or use existing classes that
> have properties implemented in their own way.

Examples:

#### JavaScript with build tools

Currently the best way to write JavaScript code with `classy-solid` is if you have a
build setup in place (soon decorators will be native in JavaScript engines and a
build step will not be necessary for decorators, but will still be necessary for
JSX templates).

The [Babel](https://babeljs.io/) compiler, for example, allows use of decorators
and JSX (not this example shows a variety of way to do things, but not all are
recommended, see the idiomatic example afterwards):

```jsx
import {component, signal, memo, effect} from 'classy-solid'
import {onMount, onCleanup, createEffect} from 'solid-js'

export
@component
class MyComp {
	@signal name = 'Anon'
	@signal count = 1

	#h1

	onMount() {
		console.log('onMount method, h1 element reference:', this.#h1)

		this.int = setInterval(() => this.count++, 1000)

		// Clean up like this (recommended),
		onCleanup(() => clearInterval(this.int))
	}

	// or clean up like this.
	onCleanup() {
		clearInterval(this.int)
	}

	// Create memo properties on the class (backed by Solid createMemo).
	@memo get doubleCount() {
		return this.count * 2
	}
	@memo set doubleCount(value) {
		// providing an empty setter makes this a writable memo (backed by createWritableMemo from solid-primitives)
	}

	// This effect is public (not recommended, if people need to rely on calling
	// it, something is wrong, effects should be solely dependent on reactive
	// state).
	@effect logDoubleCount() {
		console.log('Double count is now:', this.doubleCount)

		// nested effects
		createEffect(() => {
			/*...*/
		})

		// cleanup
		onCleanup(() => {
			/*...*/
		})
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
		// class instance, which is why the passed in `count={}` prop is
		// also accessible as `this.count` above.
		return (
			<h1 ref={this.#h1}>
				Hello, my name is {this.name}! The count is {props.count}. The double count is {this.doubleCount}.
			</h1>
		)
	}
}

render(() => <MyComp name="Joe Pea" />, document.body)
```

The above example shows a class component with multiple ways of doing things
(not recommended!). When using class components, the most idiomatic practice is
to use top level effects with `@effect`, and all state in the class with
`@signal`/`@memo` without props via `template`:

```jsx
import {component, signal, memo, effect} from 'classy-solid'
import {onCleanup} from 'solid-js'

export
@component
class MyComp {
	@signal name = 'Anon'
	@signal count = 1

	#h1

	@memo get doubleCount() {
		return this.count * 2
	}

	onMount() {
		console.log('onMount, h1 element reference:', this.#h1)

		this.int = setInterval(() => this.count++, 1000)
		onCleanup(() => clearInterval(this.int))
	}

	@effect #logDoubleCount() {
		console.log('Double count is now:', this.doubleCount)

		// If this effect has anything to clean up:
		onCleanup(() => {
			/*...*/
		})
	}

	template = () => (
		<h1 ref={this.#h1}>
			Hello, my name is {this.name}! The count is {this.count}. The double count is {this.doubleCount}.
		</h1>
	)
}

render(() => <MyComp name="David Base" />, document.body)
```

#### JavaScript without build tools

For plain JS users without build setups or that prefer not using decorators or
JSX, use `component`, `signalify`, and `memoify` via plain function calls, and
use Solid's [`html` template
tag](https://github.com/solidjs/solid/tree/main/packages/solid/html) for
templating because JSX requires compilation. Here's the same example as above
but without decorators or JSX:

```js
import {component, signalify, memoify} from 'classy-solid'
import {onCleanup, createEffect} from 'solid-js'
import html from 'solid-js/html'

const MyComp = component(
	class {
		name = 'Anon'
		count = 1

		#h1

		get doubleCount() {
			return this.count * 2
		}

		constructor() {
			// Signalify all own properties, i.e. class fields.
			signalify(this)

			// Or, to signalify specific properties only (see signalify() docs).
			// signalify(this, 'name', 'count')

			// Initialize memos (explicit mode because getters are not own properties).
			memoify(this, 'doubleCount')

			// This will not work, because getters are not own properties:
			// memoify(this)
		}

		onMount() {
			console.log('h1 element:', this.#h1)

			this.int = setInterval(() => this.count++, 1000)
			onCleanup(() => clearInterval(this.int))

			createEffect(() => this.logDoubleCount())
		}

		logDoubleCount() {
			console.log('Double count is now:', this.doubleCount)

			// If this effect has anything to clean up:
			onCleanup(() => {
				/*...*/
			})
		}

		template = () =>
			html`<h1 ref=${el => (this.#h1 = el)}>
				Hello, my name is ${() => this.name}! The count is ${() => this.count}. The double count is ${() =>
					this.doubleCount}.
			</h1>`
	},
)

render(() => html`<${MyComp} name="Tito Bouzout" />`, document.body)
```

> **Note** The new decorators proposal reached stage 3, so JavaScript will have
> decorators natively soon and won't require compiler support. JSX will still
> require compilation.

For reference, here's the same example using the `component` decorator as a
regular function, but with properties wired up to Solid signals and memos
manually, which is the equivalent of what the `@signal` and `@memo` decorators
(or `signalify()` and `memoify()` functions) do under the hood for convenience,
but with a lot more boilerplate:

```jsx
import {component} from 'classy-solid'
import {createSignal, createMemo, createEffect, onCleanup} from 'solid-js'
import html from 'solid-js/html'

const MyComp = component(
	class MyComp {
		#name = createSignal('Anon')

		get name() {
			// read from a Solid signal
			const [get] = this.#name
			return get()
		}
		set name(value) {
			// write to a Solid signal
			const [, set] = this.#name
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

		#h1

		#doubleCount = createMemo(() => {
			return this.count * 2
		})

		get doubleCount() {
			return this.#doubleCount()
		}

		onMount() {
			console.log('h1 element:', this.#h1)

			this.int = setInterval(() => this.count++, 1000)
			onCleanup(() => clearInterval(this.int))

			// log doubleCount
			createEffect(() => {
				console.log('Double count is now:', this.doubleCount)

				// If this effect has anything to clean up:
				onCleanup(() => {
					/*...*/
				})
			})
		}

		template = () =>
			html`<h1 ref=${el => (this.#h1 = el)}>
				Hello, my name is ${() => this.name}! The count is ${() => this.count}. The double count is ${() =>
					this.doubleCount}.
			</h1>`
	},
)

render(() => html`<${MyComp} name="Batman" />`, document.body)
```

#### Accessing the class instance with `ref`:

The `ref` prop provides access to the actual class instance, similar to element
refs in Solid. This is useful for calling methods, accessing properties, or
integrating with imperative APIs.

```jsx
import {component, signal} from 'classy-solid'
import {render} from 'solid-js/web'

@component
class Counter {
	@signal count = 0

	increment() {
		this.count++
	}

	template() {
		return <div>Count: {this.count}</div>
	}
}

let counterRef!

render(() => (
	<>
		<Counter ref={(instance) => (counterRef = instance)} />
		<button onClick={() => counterRef.increment()}>Increment</button>
	</>
), document.body)
```

The `ref` callback is called with the class instance after it's created, after
`onMount` runs. You can use it to store a reference, call methods, or pass the
instance to other parts of your app.

#### TypeScript definition

TypeScript supports decorators out of the box with no additional setup needed.

> **Note** The same rules apply here as with decorators in the previous
> JavaScript section, and the only difference here is added type checking.

```tsx
import {component, signal, memo, Props} from 'classy-solid'

@component
class MyComp {
	// Define `PropTypes` on your class to define prop types for JSX. Note, this
	// property does not actually need to exist at runtime and is not used at
	// runtime, so here we use the `declare` to tell TS not to assume it exists
	// for the sake of type checking.
	// Do not try to use this property at runtime!
	declare PropTypes: Props<this, 'name' | 'count'>

	@signal name = 'Anon'
	@signal count = 123

	// Example: this is private, used only within the class.
	@memo get #doubleCount() {
		return this.count * 2
	}

	// This property will not appear in the JSX prop types, because we did not
	// list it in the `PropTypes` definition.
	foo = 'blah'

	#h1: HTMLHeadingElement | undefined = undefined

	template = () => (
		<h1 ref={this.#h1}>
			Hello, my name is {this.name}! The count is {this.count}. The double count is {this.#doubleCount}.
		</h1>
	)
}

render(() => <MyComp name="Robin" count={456} />, document.body)
```

#### Type-safe refs in TypeScript:

```tsx
import {component, signal, Props} from 'classy-solid'

@component
class Counter {
	declare PropTypes: Props<this, 'count'>

	@signal count = 0
	increment = () => this.count++
	template = () => <div>Count: {this.count}</div>
}

// Then depending on what you are doing:

// Use a ref in a class component, with class-based signal and effect
@component
class Example1 {
	@signal counterRef: Counter | null = null

	@effect #log() {
		console.log(this.counterRef)
	}

	template() {
		return <Counter ref={(c: Counter) => (this.counterRef = c)} count={5} />
	}
}

// Use a ref in a function component
function Example2() {
	let [counterRef, setCounterRef] = createSignal<Counter>()

	createEffect(() => console.log(counterRef()))

	return <Counter ref={setCounterRef} count={5} />
}

// Use a ref in a class component, in the template method like a component
@component
class Example1 {
	template() {
		let [counterRef, setCounterRef] = createSignal<Counter>()

		createEffect(() => console.log(counterRef()))

		return <Counter ref={setCounterRef} count={5} />
	}
}
```

### `@reactive` (deprecated)

**⚠️ DEPRECATED:** Use [`@untracked`](#untracked) instead. This decorator is no
longer needed for making `@signal` or `@memo` work. It now serves only as an
alias to `@untracked` for backward compatibility.

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

Convert properties on an object into Solid signal-backed properties. This is
what [`@signal`](#signal) uses behind the scenes.

Useful with plain objects and classes when decorators are unavailable or
undesired.

**Two modes:**

1. **Explicit mode** (properties listed): Only the specified properties become
   reactive signals.
2. **Automatic mode** (no properties listed): All own enumerable properties
   (string and symbol keys) become reactive, **except** function-valued properties,
   which are skipped by default (use `signalify()` in explicit mode for those if
   you need a signal with a function value, or use [`memoify()`](#memoify) to
   create memo functions that return derived values).

**Interplay with `memoify()`:** Call `signalify()` first to set up reactive
data properties, then call `memoify()` to set up derived memos that depend on
those signals. This mirrors the typical usage of `@signal` followed by `@memo`
when using decorators.

Here are some examples. Make certain properties on an object reactive
signal-backed properties:

```js
import {signalify} from 'classy-solid'
import {createEffect} from 'solid-js'

const obj = {foo: 1, bar: 2, baz: 3}

// Explicit mode: Make only the 'foo' and 'bar' properties reactive.
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

**Automatic mode** makes all properties signal-backed, omitting the property
names internally uses `Object.keys(obj)` (and `Object.getOwnPropertySymbols(obj)`):

```js
// Automatic mode: Make all properties reactive signals (except function-valued).
const obj = signalify({foo: 1, bar: 2, baz: 3, method() {}})
// foo, bar, baz are now reactive. method() is skipped.
```

The object passed in is the same object returned:

```js
let test
const obj = signalify(test = {...})
console.log(obj === test) // true
```

To signalify function-valued properties, explicitly list them:

```js
const obj = signalify({foo: 1, bar: 2, baz: 3, method() {}}) // foo, bar, baz only
signalify(obj, 'method') // now method is also signalified
```

**Why exclude methods by default?** Functions are typically computed/derived
values best handled by [`memoify()`](#memoify) to avoid unnecessary reactivity
on static behavior, so `memoify()` will handle them by default. The
`signalify()` function skips them by default to allow `memoify()` to handle
them, avoiding a conflict and making usage easy by default. Sometimes you may
want a function-valued signal, so you can list them explicitly in that case.

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
class Counter {
	@signal count = 0
	@signal on = true

	method() {}
}
```

**Plain JS example combining `signalify()` and `memoify()`:**

Without decorators, you can achieve similar reactive behavior manually:

```js
import {signalify, memoify} from 'classy-solid'
import {createEffect} from 'solid-js'

const counter = {
	count: 0,
	num: 10,

	// Computed value (will be memoified)
	get sum() {
		return this.count + this.num
	},

	increment() {
		this.count++
	},
}

// Step 1: Make data properties reactive
signalify(counter, 'count', 'num')

// Step 2: Turn computed properties into memos
memoify(counter, 'sum')

setInterval(() => counter.increment(), 1000)

createEffect(() => {
	console.log(`Count is: ${counter.count}`)
})

createEffect(() => {
	console.log(`Sum is: ${counter.sum}`)
})

counter.count = 5 // Logs "Count is: 5" and "Sum is: 15"
counter.num = 20 // Logs "Sum is: 25"
```

This pattern (signalify first, memoify second) mirrors the decorator approach
(`@signal` then `@memo`) and is ideal for plain objects or when decorators are
not available.

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

When to prefer [`@memo`](#memo) vs `memoify()`:

- Use [`@memo`](#memo) inside modern class syntax where decorators are supported.
- Use `memoify()` for plain objects, prototypes, or when decorators are undesirable or not available.

See also: [`signalify()`](#signalify) for creating reactive data properties that
memos can depend on.

### `Effectful`

`Effectful` is a class-factory mixin that adds reactive effect management to
any class. It provides:

- `this.createEffect(fn)` - Creates a Solid effect tied to the instance.
- `this.stopEffects()` - Stops all effects created via `createEffect()` on this instance.

**Purpose:** Useful for classes that need to manage multiple effects with a
single cleanup call, especially in component-like patterns (custom elements,
lifecycle-driven classes, etc.).

**Cleanup semantics:** Effects are created within a shared Solid.js owner root
for the instance. Calling `stopEffects()` disposes that root, stopping all
effects. Subsequent `createEffect()` calls create a new root. Typically you
create a class, then call `stopEffects()` when the instance is no longer needed
(for example with Custom Elements, in `disconnectedCallback`).

**Use cases:**

- Custom elements with `connectedCallback` / `disconnectedCallback`.
- Classes with explicit lifecycle methods (e.g., `start()` / `stop()`).
- Any pattern where you want effects grouped and cleaned up when finished.

Here's an example of a plain class extending Effectful, where effects are
created and then the instance is later cleaned up (note how on `onCleanup` is
used within an effect to clean up resources like intervals):

```js
import {onCleanup} from 'solid-js'
import {signal, Effectful} from 'classy-solid'

class Counter extends Effectful(Object) {
	@signal count = 0
	@signal num = 10

	increment() {
		this.count++
	}

	constructor() {
		super()

		// Create some effects
		this.createEffect(() => {
			console.log('count:', this.count)
		})

		this.createEffect(() => {
			console.log('num:', this.num)
		})

		this.createEffect(() => {
			const int = setInterval(() => this.increment(), 1000)
			// Cleanup interval when effects are disposed
			onCleanup(() => clearInterval(int))
		})
	}
}

const counter = new Counter() // effects start

// later, when finished with the counter...
counter.stopEffects() // effects stop
```

Here's an example with a custom element that starts effects on connected and
cleans them up on disconnect:

```js
import {onCleanup} from 'solid-js'
import {memo, signal, Effectful} from 'classy-solid'

class CounterDisplay extends Effectful(HTMLElement) {
	static {
		customElements.define('counter-display', this)
	}

	@signal count

	@memo get double() {
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

		this.createEffect(() => {
			const int = setInterval(() => this.count++, 1000)
			// Cleanup interval when effects are disposed
			onCleanup(() => clearInterval(int))
		})
	}

	disconnectedCallback() {
		// Stop the effects, and clear them as new ones will be created on next
		// connect.
		this.clearEffects()
	}
}

const counterEl = document.createElement('counter-display')
document.body.append(counterEl) // effects start

// ...later, when removed from DOM...
counterEl.remove() // effects stop
```

> [!Note] Note
> `createEffect()` creates a single owner root for all effects for the current
> instance, unless it is called inside another root in which case it'll use that
> root.

### `Effects`

A pre-instantiated version of `Effectful(Object)`, providing the same API
without requiring a mixin call, for convenience.

**Purpose:** Use `Effects` when:

- You don't need to extend a specific base class.
- You want multiple independent effect groups within a single class.

**When to choose `Effects` over `Effectful`:**

- `Effectful(BaseClass)` - When you want effect management baked into your class hierarchy.
- `new Effects()` - When you want a standalone effect manager or multiple independent groups.

Useful when not need to extend a specific base class other than the default
`Object`:

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

Synchronizes two Solid signals bidirectionally: setting one updates the other,
and vice versa, without causing an infinite loop.

**Purpose:** Useful for keeping two separate signal sources in sync, such as:

- Syncing a prop signal with internal state.
- Bridging signals across component boundaries or libraries.
- Maintaining consistency between derived/computed signals.

**How it works:** Uses an internal tracking mechanism to detect when one signal
changes and propagate to the other, skipping redundant updates.

**Signature:**

```ts
syncSignals<T>(
  getterA: Accessor<T>, setterA: Setter<T>,
  getterB: Accessor<T>, setterB: Setter<T>
): [[getterA: Accessor<T>, setterA: Setter<T>], [getterB: Accessor<T>, setterB: Setter<T>]]
```

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

Creates two synchronized signals in one call.

**Purpose:** Shorthand for creating and syncing signals simultaneously, reducing boilerplate.

**When to use:**

- You need two signals synced from the start with the same initial value.
- You want cleaner code than manually calling `createSignal()` twice and then `syncSignals()`.

**Signature:**

```ts
createSyncedSignals<T>(initialValue: T): [[Accessor<T>, Setter<T>], [Accessor<T>, Setter<T>]]
```

Equivalent to:

```js
const [[foo, setFoo], [bar, setBar]] = syncSignals(...createSignal(0), ...createSignal(0))
```

Example:

```js
const [[foo, setFoo], [bar, setBar]] = createSyncedSignals(0)
```

### `createStoppableEffect`

⚠️ **Experimental** - Use with caution (see below).

Creates a Solid effect that can be manually stopped via a `.stop()` method.

**Purpose:** Provides fine-grained control over individual effects without
needing a parent owner root or manual disposal. Note, this is an experimental API
because of potential memory management caveats (see below).

**Signature:**

```ts
createStoppableEffect(fn: EffectFunction): { stop: () => void }
```

Example:

```js
const effect = createStoppableEffect(() => {
	// ...
})

// ...later, stop the effect from running again.
effect.stop()
```

**⚠️ Memory leak caveat:** When created inside a long-lived parent reactive
context (e.g., app-level root), stopped effects **will not be garbage
collected** until the parent context is disposed. This can cause memory leaks
if many effects are created and stopped over time.

**Safe usage:**

- Create outside reactive contexts (effects will GC freely after `.stop()`).
- Use [`Effectful`](#effectful) or [`Effects`](#effects) if you need grouped cleanup.
- Avoid creating many stoppable effects within a single long-lived root.

**Why experimental?** Solid's ownership model doesn't yet support detaching
child computations from parent roots while preserving proper GC. This API may
change in future versions.

## Error Handling and Caveats

### Writable Memo Overrides

Setting a writable memo overrides the computed value until dependencies change:

```js
class Counter {
  @signal a = 1
  @signal b = 2
  @memo sum(_v?: number) { return this.a + this.b }
}

const c = new Counter()
console.log(c.sum()) // 3 (computed)
c.sum(100)           // Override to 100
console.log(c.sum()) // 100 (overridden)
c.a = 5              // Dependency changed
console.log(c.sum()) // 7 (recomputed)
```

**Caveat:** Overridden values are **not persisted** across dependency changes.
If you need persistent overrides, use a separate signal to track the override
state.

### Static Fields

- **Static fields:** Not yet supported by `@signal` or `@memo`.

### Memory Considerations

- **Effects and Roots:** Effects created via [`Effectful`](#effectful) /
  [`Effects`](#effects) are grouped under an owner root. Always call
  `stopEffects()` when done to avoid memory leaks.
- **Stoppable Effects:** See caveats in [`createStoppableEffect`](#createstoppableeffect).
