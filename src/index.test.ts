import {createComputed, createEffect, createRoot, createSignal, untrack} from 'solid-js'
import {createMutable} from 'solid-js/store'
import {render} from 'solid-js/web'
import html from 'solid-js/html'
import {
	createSignalObject,
	reactive,
	signalify,
	createSignalFunction,
	signal,
	createDeferredEffect,
	component,
} from './index.js'

// TODO move type def to @lume/cli, map @types/jest's `expect` type into the
// global env.
declare global {
	function expect(...args: any[]): any
}

describe('classy-solid', () => {
	describe('createSignalObject()', () => {
		it('has gettable and settable values via .get and .set methods', async () => {
			const num = createSignalObject(0)

			// Set the variable's value by passing a value in.
			num.set(1)
			// Read the variable's value by calling it with no args.
			expect(num.get()).toBe(1)

			// increment example:
			const setResult = num.set(num.get() + 1)
			expect(num.get()).toBe(2)
			expect(setResult).toBe(2)

			// Set with a function that accepts the previous value and returns the next value.
			num.set(n => n + 1)
			expect(num.get()).toBe(3)
		})
	})

	describe('createSignalFunction()', () => {
		it('has gettable and settable values via a single overloaded function', async () => {
			const num = createSignalFunction(0)

			// Set the variable's value by passing a value in.
			num(1)
			// Read the variable's value by calling it with no args.
			expect(num()).toBe(1)

			// increment example:
			const setResult = num(num() + 1)
			expect(num()).toBe(2)
			expect(setResult).toBe(2)

			// Set with a function that accepts the previous value and returns the next value.
			num(n => n + 1)
			expect(num()).toBe(3)
		})
	})

	describe('createDeferredEffect()', () => {
		it('works', async () => {
			const count = createSignalFunction(0)
			const foo = createSignalFunction(0)

			let runCount = 0

			const stop = (() => {
				let stop!: () => void

				createRoot(_stop => {
					stop = _stop

					// Runs once initially after the current root context just
					// like createEffect, then any time it re-runs due to a
					// change in a dependency, the re-run will be deferred in
					// the next microtask and will run only once (not once per
					// signal that changed)
					createDeferredEffect(() => {
						count()
						foo()
						runCount++
					})
				})

				return stop
			})()

			// Queues the effect to run in the next microtask
			count(1)
			count(2)
			foo(3)

			// Still 1 because the deferred effect didn't run yet, it will in the next microtask.
			expect(runCount).toBe(1)

			await Promise.resolve()

			// It ran only once in the previous microtask (batched), not once per signal write.
			expect(runCount).toBe(2)

			count(3)
			count(4)
			foo(5)

			expect(runCount).toBe(2)

			await Promise.resolve()

			expect(runCount).toBe(3)

			// Stops the effect from re-running. It can now be garbage collected.
			stop()

			count(3)
			count(4)
			foo(5)

			expect(runCount).toBe(3)

			await Promise.resolve()

			// Still the same because it was stopped, so it didn't run in the
			// macrotask prior to the await.
			expect(runCount).toBe(3)

			// Double check just in case (the wrong implementation would make it
			// skip two microtasks before running).
			await Promise.resolve()
			expect(runCount).toBe(3)
		})
	})

	describe('@reactive, @signal, and signalify', () => {
		it('makes class properties reactive, using class and property/accessor decorators', () => {
			@reactive
			class Butterfly {
				@signal colors = 3
				_wingSize = 2

				@signal
				get wingSize() {
					return this._wingSize
				}
				set wingSize(s: number) {
					this._wingSize = s
				}
			}

			const b = new Butterfly()

			testButterflyProps(b)
		})

		it('maintains reactivity in subclass overridden fields', async () => {
			@reactive
			class Butterfly {
				@signal colors = 3
				_wingSize = 2

				@signal
				get wingSize() {
					return this._wingSize
				}
				set wingSize(s: number) {
					this._wingSize = s
				}
			}

			@reactive
			class SubButterfly extends Butterfly {
				@signal override colors = 123
			}

			const b = new SubButterfly()

			testButterflyProps(b, 123)
		})

		it('does not prevent superclass constructor from receiving subclass constructor args', () => {
			@reactive
			class Insect {
				constructor(public double: number) {}
			}

			@reactive
			class Butterfly extends Insect {
				@signal colors = 3
				_wingSize = 2

				@signal
				get wingSize() {
					return this._wingSize
				}
				set wingSize(s: number) {
					this._wingSize = s
				}

				constructor(arg: number) {
					super(arg * 2)
				}
			}

			const b = new Butterfly(4)

			expect(b.double).toBe(8)
			testButterflyProps(b)
		})

		it('makes class properties reactive, not using any decorators, specified in the constructor', () => {
			class Butterfly {
				colors = 3
				_wingSize = 2

				get wingSize() {
					return this._wingSize
				}
				set wingSize(s: number) {
					this._wingSize = s
				}

				constructor() {
					signalify(this, 'colors', 'wingSize')
				}
			}

			const b = new Butterfly()

			testButterflyProps(b)

			// quick type check:
			const b2 = new Butterfly()
			signalify(
				b2,
				'colors',
				'wingSize',
				// @ts-expect-error "foo" is not a property on Butterfly
				'foo',
			)
		})

		it('makes class properties reactive, with signalify in the constructor', () => {
			class Butterfly {
				colors: number
				_wingSize: number

				get wingSize() {
					return this._wingSize
				}
				set wingSize(s: number) {
					this._wingSize = s
				}

				constructor() {
					this.colors = 3
					this._wingSize = 2

					signalify(this, 'colors', 'wingSize')
				}
			}

			const b = new Butterfly()

			testButterflyProps(b)
		})

		it('works with a function-style class, with signalify in the constructor', () => {
			function Butterfly() {
				// @ts-ignore
				this.colors = 3
				// @ts-ignore
				this._wingSize = 2

				// @ts-ignore no type checking for ES5-style classes.
				signalify(this, 'colors', 'wingSize')
			}

			Butterfly.prototype = {
				get wingSize() {
					return this._wingSize
				},
				set wingSize(s: number) {
					this._wingSize = s
				},
			}

			// @ts-ignore
			const b = new Butterfly()
			testButterflyProps(b)
		})

		it('works with a function-style class, with properties on the prototype, and signalify in constructor', () => {
			function Butterfly() {
				// @ts-ignore no type checking for ES5-style classes.
				signalify(this, 'colors', 'wingSize')
			}

			Butterfly.prototype = {
				colors: 3,
				_wingSize: 2,

				get wingSize() {
					return this._wingSize
				},
				set wingSize(s: number) {
					this._wingSize = s
				},
			}

			// @ts-ignore no type checking for ES5-style classes.
			const b = new Butterfly()
			testButterflyProps(b)
		})

		it('can be used on a function-style class, with properties on the prototype, and signalify on the prototype', () => {
			function Butterfly() {}

			Butterfly.prototype = {
				colors: 3,
				_wingSize: 2,

				get wingSize() {
					return this._wingSize
				},
				set wingSize(s: number) {
					this._wingSize = s
				},
			}

			signalify(Butterfly.prototype, 'colors', 'wingSize')

			// @ts-ignore no type checking for ES5-style classes.
			const b = new Butterfly()
			testButterflyProps(b)
		})

		it('can be used on a function-style class, with properties in the constructor, and signalify on the prototype', () => {
			function Butterfly() {
				// @ts-ignore
				this.colors = 3
				// @ts-ignore
				this._wingSize = 2
			}

			Butterfly.prototype = {
				get wingSize() {
					return this._wingSize
				},
				set wingSize(s: number) {
					this._wingSize = s
				},
			}

			signalify(Butterfly.prototype, 'colors', 'wingSize')

			// @ts-ignore
			const b = new Butterfly()
			testButterflyProps(b)
		})

		it('throws an error when @signal is used without @reactive', async () => {
			expect(() => {
				// user forgot to use @reactive here
				class Foo {
					@signal foo = 'hoo'
				}

				Foo

				@reactive
				class Bar {
					@signal bar = 123
				}

				new Bar()
			}).toThrow('Did you forget')

			// TODO how to check for an error thrown from a microtask?
			// (window.addEventListener('error') seems not to work)
			//
			// It just won't work, the error seems to never fire here in the
			// tests, but it works fine when testing manually in Chrome.

			// const errPromise = new Promise<ErrorEvent>(r => window.addEventListener('error', e => r(e), {once: true}))

			// @reactive
			// class Foo {
			// 	@signal foo = 'hoo'
			// }

			// Foo

			// // user forgot to use @reactive here
			// class Bar {
			// 	@signal bar = 123
			// }

			// Bar

			// const err = await errPromise

			// expect(err.message).toContain('Did you forget')
		})

		it('works with function values', () => {
			// This test ensures that functions are handled propertly, because
			// if passed without being wrapped to a signal setter it will be
			// called immediately with the previous value and be expected to
			// return a new value, instead of being set as the actual new value.

			@reactive
			class Doer {
				@signal do: (() => unknown) | null = null
			}

			const doer = new Doer()

			expect(doer.do).toBe(null)

			const newFunc = () => 123
			doer.do = newFunc

			expect(doer.do).toBe(newFunc)
			expect(doer.do()).toBe(123)
		})

		describe('signalify', () => {
			it('is not tracked inside of an effect to prevent loops', () => {
				// Library author provides obj
				const obj = {n: 123}
				signalify(obj, 'n') // library author might signalify obj.n

				// User code:
				createEffect(() => {
					// o.n may or may not already be signalified, user does not know, but they want to be sure they can react to its changes.
					signalify(obj, 'n')

					obj.n = 123 // does not make an infinite loop

					// A deeper effect will be reading the property.
					createEffect(() => {
						console.log(obj.n)
					})
				})

				// No expectations in this test, the test passes if a maximum
				// callstack size error (infinite loop) does not happen.
			})
		})

		it('show that signalify causes constructor to be reactive when used manually instead of decorators', () => {
			class Foo {
				amount = 3

				constructor() {
					signalify(this, 'amount')
				}
			}

			class Bar extends Foo {
				double = 0

				constructor() {
					super()
					signalify(this, 'double')
					this.double = this.amount * 2 // this tracks access of .amount
				}
			}

			let count = 0
			let b!: Bar

			createEffect(() => {
				b = new Bar() // tracks .amount
				count++
			})

			expect(count).toBe(1)

			b.amount = 4 // triggers

			expect(count).toBe(2)
		})

		it('show how to manually untrack constructors when not using decorators', () => {
			class Foo {
				amount = 3

				constructor() {
					signalify(this, 'amount')
				}
			}

			class Bar extends Foo {
				double = 0

				constructor() {
					super()
					signalify(this, 'double')

					untrack(() => {
						this.double = this.amount * 2
					})
				}
			}

			let count = 0
			let b!: Bar

			createEffect(() => {
				b = new Bar() // does not track .amount
				count++
			})

			expect(count).toBe(1)

			b.amount = 4 // will not trigger

			expect(count).toBe(1)
		})

		it('automatically does not track reactivity in constructors when using decorators', () => {
			@reactive
			class Foo {
				@signal amount = 3
			}

			@reactive
			class Bar extends Foo {
				@signal double = 0

				constructor() {
					super()
					this.double = this.amount * 2 // this read of .amount should not be tracked
				}
			}

			let b: Bar
			let count = 0

			function noLoop() {
				createEffect(() => {
					b = new Bar() // this should not track
					count++
				})
			}

			expect(noLoop).not.toThrow()

			const b2 = b!

			b!.amount = 4 // hence this should not trigger

			// If the effect ran only once initially, not when setting b.colors,
			// then both variables should reference the same instance
			expect(count).toBe(1)
			expect(b!).toBe(b2)
		})
	})

	describe('@component', () => {
		it('allows to define a class using class syntax', () => {
			let onMountCalled = false
			let onCleanupCalled = false

			@component
			class CoolComp {
				onMount() {
					onMountCalled = true
				}

				onCleanup() {
					onCleanupCalled = true
				}

				template(props: any) {
					expect(props.foo).toBe(123)
					return html`<div>hello classes!</div>`
				}
			}

			const root = document.createElement('div')
			document.body.append(root)

			const dispose = render(() => html`<${CoolComp} foo=${123} />`, root)

			expect(root.textContent).toBe('hello classes!')
			expect(onMountCalled).toBe(true)
			expect(onCleanupCalled).toBe(false)

			dispose()
			root.remove()

			expect(onCleanupCalled).toBe(true)

			// throws on non-class use
			expect(() => {
				class CoolComp {
					// @ts-ignore
					@component
					onMount() {}
				}
				CoolComp
			}).toThrow('component decorator should only be used on a class')
		})

		it('works in tandem with @reactive and @signal for reactivity', async () => {
			@component
			@reactive
			class CoolComp {
				@signal foo = 0
				@signal bar = 0

				template() {
					return html`<div>foo: ${() => this.foo}, bar: ${() => this.bar}</div>`
				}
			}

			const root = document.createElement('div')
			document.body.append(root)

			const [a, setA] = createSignal(1)
			const b = createSignalFunction(2)

			// FIXME Why do we need `() => b()` instead of just `b` here? Does `html`
			// check the `length` of the function and do something based on
			// that? Or does it get passed to a @signal property's setter and
			// receives the previous value?
			const dispose = render(() => html`<${CoolComp} foo=${a} bar=${() => b()} />`, root)

			expect(root.textContent).toBe('foo: 1, bar: 2')

			setA(3)
			b(4)

			expect(root.textContent).toBe('foo: 3, bar: 4')

			dispose()
			root.remove()
		})

		it('works without decorators', () => {
			const CoolComp = component(
				class CoolComp {
					foo = 0
					bar = 0

					constructor() {
						signalify(this)
					}

					template() {
						return html`<div>foo: ${() => this.foo}, bar: ${() => this.bar}</div>`
					}
				},
			)

			const root = document.createElement('div')
			document.body.append(root)

			const [a, setA] = createSignal(1)
			const b = createSignalFunction(2)

			// FIXME Why do we need `() => b()` instead of just `b` here? Does `html`
			// check the `length` of the function and do something based on
			// that? Or does it get passed to a @signal property's setter and
			// receives the previous value?
			const dispose = render(() => html`<${CoolComp} foo=${a} bar=${() => b()} />`, root)

			expect(root.textContent).toBe('foo: 1, bar: 2')

			setA(3)
			b(4)

			expect(root.textContent).toBe('foo: 3, bar: 4')

			dispose()
			root.remove()
		})

		// FIXME not working, the spread doesn't seem to do anything.
		xit('works with reactive spreads', async () => {
			@component
			@reactive
			class CoolComp {
				@signal foo = 0
				@signal bar = 0

				template() {
					return html`<div>foo: ${() => this.foo}, bar: ${() => this.bar}</div>`
				}
			}

			const root = document.createElement('div')
			document.body.append(root)

			let o = createMutable<any>({o: {foo: 123}})

			// neither of these work
			// const dispose = render(() => html`<${CoolComp} ...${() => o.o} />`, root)
			const dispose = render(() => html`<${CoolComp} ...${o.o} />`, root)

			expect(root.textContent).toBe('foo: 123, bar: 0')

			o.o = {bar: 456}

			expect(root.textContent).toBe('foo: 123, bar: 456')

			dispose()
			root.remove()
		})
	})
})

function testButterflyProps(b: {colors: number; wingSize: number; _wingSize: number}, initialColors = 3) {
	let count = 0

	createRoot(() => {
		createComputed(() => {
			b.colors
			b.wingSize
			count++
		})
	})

	expect(b.colors).toBe(initialColors, 'initial colors value')
	expect(b.wingSize).toBe(2, 'initial wingSize value')
	expect(b._wingSize).toBe(2, 'ensure the original accessor works')
	expect(count).toBe(1, 'Should be reactive')

	b.colors++

	expect(b.colors).toBe(initialColors + 1, 'incremented colors value')
	expect(count).toBe(2, 'Should be reactive')

	b.wingSize++

	expect(b.wingSize).toBe(3, 'incremented wingSize value')
	expect(b._wingSize).toBe(3, 'ensure the original accessor works')
	expect(count).toBe(3, 'Should be reactive')
}

//////////////////////////////////////////////////////////////////////////
// createSignalObject type tests ///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

{
	const num = createSignalObject(1)
	let n1: number = num.get()
	n1
	num.set(123)
	num.set(n => (n1 = n + 1))
	// @ts-expect-error Expected 1 arguments, but got 0. ts(2554)
	num.set()

	const num3 = createSignalObject<number>()
	// @ts-expect-error   Type 'undefined' is not assignable to type 'number'. ts(2322)
	let n3: number = num3.get()
	num3.set(123)
	num3.set(undefined) // ok, accepts undefined
	// @ts-expect-error Object is possibly 'undefined'. ts(2532) (the `n` value)
	num3.set(n => (n3 = n + 1))
	// num3.set() // ok, accepts undefined // FIXME broke in Solid 1.7.9

	// @ts-expect-error Argument of type 'boolean' is not assignable to parameter of type 'number'. ts(2345)
	const num4 = createSignalObject<number>(true)

	const bool = createSignalObject(true)
	let b1: boolean = bool.get()
	b1
	bool.set(false)
	bool.set(b => (b1 = !b))
	// @ts-expect-error Expected 1 arguments, but got 0. ts(2554)
	bool.set()

	const bool2 = createSignalObject<boolean>()
	// @ts-expect-error   Type 'undefined' is not assignable to type 'number'. ts(2322)
	let n4: boolean = bool2.get()
	bool2.set(false)
	bool2.set(undefined) // ok, accepts undefined
	bool2.set(n => (n4 = !n)) // ok because undefined is being converted to boolean
	// @ts-expect-error Type 'boolean | undefined' is not assignable to type 'boolean'. ts(2322)
	bool2.set(n => (n4 = n))
	// bool2.set() // ok, accepts undefined // FIXME try Solid 1.7.9

	const func = createSignalObject(() => 1)
	// @ts-expect-error 1 is not assignable to function (no overload matches)
	func.set(() => 1)
	func.set(() => (): 1 => 1) // ok, set the value to a function
	const fn: () => 1 = func.get() // ok, returns function value
	fn
	const n5: 1 = func.get()()
	n5

	const func2 = createSignalObject<() => number>(() => 1)
	// @FIXME-ts-expect-error number is not assignable to function (no overload matches)
	func2.set(() => 1) // FIXME should be a type error. Try Solid 1.7.9
	func2.set(() => () => 1) // ok, set the value to a function
	const fn2: () => number = func2.get() // ok, returns function value
	fn2
	const n6: number = func2.get()()
	n6

	const stringOrFunc1 = createSignalObject<(() => number) | string>('')
	// @FIXME-ts-expect-error number not assignable to string | (()=>number) | undefined
	stringOrFunc1.set(() => 1) // FIXME should be a type error. Try Solid 1.7.9
	// @ts-expect-error FIXME try Solid 1.7.9
	const sf1: () => number = stringOrFunc1.set(() => () => 1)
	sf1
	// @ts-expect-error FIXME try Solid 1.7.9
	const sf2: string = stringOrFunc1.set('oh yeah')
	sf2
	// @ts-expect-error FIXME try Solid 1.7.9
	const sf3: string = stringOrFunc1.set(() => 'oh yeah')
	sf3
	// @ts-expect-error cannot set signal to undefined
	stringOrFunc1.set()
	// @ts-expect-error cannot set signal to undefined
	stringOrFunc1.set(undefined)
	// @ts-expect-error return value might be string
	const sf6: () => number = stringOrFunc1.get()
	sf6
	const sf7: (() => number) | string | undefined = stringOrFunc1.get()
	sf7
	const sf8: (() => number) | string = stringOrFunc1.get()
	sf8

	const stringOrFunc2 = createSignalObject<(() => number) | string>()
	// @FIXME-ts-expect-error number not assignable to string | (()=>number) | undefined
	stringOrFunc2.set(() => 1) // FIXME should be a type error. Try Solid 1.7.9
	// @ts-expect-error FIXME try Solid 1.7.9
	const sf9: () => number = stringOrFunc2.set(() => () => 1)
	sf9
	// @ts-expect-error FIXME try Solid 1.7.9
	const sf10: string = stringOrFunc2.set('oh yeah')
	sf10
	// @ts-expect-error FIXME try Solid 1.7.9
	const sf11: string = stringOrFunc2.set(() => 'oh yeah')
	sf11
	// @ts-expect-error FIXME try Solid 1.7.9
	const sf12: undefined = stringOrFunc2.set()
	sf12
	// @ts-expect-error FIXME try Solid 1.7.9
	const sf13: undefined = stringOrFunc2.set(undefined)
	sf13
	const sf14: (() => number) | string | undefined = stringOrFunc2.get()
	sf14
	// @ts-expect-error return value might be undefined
	const sf15: (() => number) | string = stringOrFunc2.get()
	sf15
}

//////////////////////////////////////////////////////////////////////////
// createSignalFunction type tests ///////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

{
	const num = createSignalFunction(1)
	let n1: number = num()
	n1
	num(123)
	num(n => (n1 = n + 1))
	num()

	const num3 = createSignalFunction<number>()
	// @ts-expect-error   Type 'undefined' is not assignable to type 'number'. ts(2322)
	let n3: number = num3()
	num3(123)
	num3(undefined) // ok, accepts undefined
	// @ts-expect-error Object is possibly 'undefined'. ts(2532) (the `n` value)
	num3(n => (n3 = n + 1))
	num3() // ok, getter

	// @ts-expect-error Argument of type 'boolean' is not assignable to parameter of type 'number'. ts(2345)
	const num4 = createSignalFunction<number>(true)

	const bool = createSignalFunction(true)
	let b1: boolean = bool()
	b1
	bool(false)
	bool(b => (b1 = !b))
	bool()

	const bool2 = createSignalFunction<boolean>()
	// @ts-expect-error   Type 'undefined' is not assignable to type 'number'. ts(2322)
	let n4: boolean = bool2()
	bool2(false)
	bool2(undefined) // ok, accepts undefined
	bool2(n => (n4 = !n)) // ok because undefined is being converted to boolean
	// @ts-expect-error Type 'boolean | undefined' is not assignable to type 'boolean'. ts(2322)
	bool2(n => (n4 = n))
	bool2() // ok, accepts undefined

	const func = createSignalFunction(() => 1)
	// @ts-expect-error 1 is not assignable to function (no overload matches)
	func(() => 1)
	func(() => (): 1 => 1) // ok, set the value to a function
	const fn: () => 1 = func() // ok, returns function value
	fn
	const n5: 1 = func()()
	n5

	const func2 = createSignalFunction<() => number>(() => 1)
	// @ts-expect-error number is not assignable to function (no overload matches)
	func2(() => 1)
	func2(() => () => 1) // ok, set the value to a function
	const fn2: () => number = func2() // ok, returns function value
	fn2
	const n6: number = func2()()
	n6

	const stringOrFunc1 = createSignalFunction<(() => number) | string>('')
	// @ts-expect-error number not assignable to string | (()=>number) | undefined
	stringOrFunc1(() => 1)
	const sf1: () => number = stringOrFunc1(() => () => 1)
	sf1
	const sf2: string = stringOrFunc1('oh yeah')
	sf2
	const sf3: string = stringOrFunc1(() => 'oh yeah')
	sf3
	stringOrFunc1() // ok, getter
	// @ts-expect-error cannot set signal to undefined
	stringOrFunc1(undefined)
	// @ts-expect-error return value might be string
	const sf6: () => number = stringOrFunc1()
	sf6
	const sf7: (() => number) | string | undefined = stringOrFunc1()
	sf7
	const sf8: (() => number) | string = stringOrFunc1()
	sf8

	const stringOrFunc2 = createSignalFunction<(() => number) | string>()
	// @ts-expect-error number not assignable to string | (()=>number) | undefined
	stringOrFunc2(() => 1)
	const sf9: () => number = stringOrFunc2(() => () => 1)
	sf9
	const sf10: string = stringOrFunc2('oh yeah')
	sf10
	const sf11: string = stringOrFunc2(() => 'oh yeah')
	sf11
	// @ts-expect-error 'string | (() => number) | undefined' is not assignable to type 'undefined'.
	const sf12: undefined = stringOrFunc2()
	sf12
	const sf13: undefined = stringOrFunc2(undefined)
	sf13
	const sf14: (() => number) | string | undefined = stringOrFunc2()
	sf14
	// @ts-expect-error return value might be undefined
	const sf15: (() => number) | string = stringOrFunc2()
	sf15
}
