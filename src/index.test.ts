import {createComputed, createRoot} from 'solid-js'
import {createSignalObject, reactive, signalify, createSignalFunction, signal, createDeferredEffect} from './index.js'

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
			expect(runCount).withContext('a').toBe(1)

			await Promise.resolve()

			// It ran only once in the previous microtask (batched), not once per signal write.
			expect(runCount).withContext('b').toBe(2)

			count(3)
			count(4)
			foo(5)

			expect(runCount).withContext('c').toBe(2)

			await Promise.resolve()

			expect(runCount).withContext('d').toBe(3)

			// Stops the autorun from re-running. It can now be garbage collected.
			stop()

			count(3)
			count(4)
			foo(5)

			expect(runCount).withContext('c').toBe(3)

			await Promise.resolve()

			// Still the same because it was stopped, so it didn't run in the
			// macrotask prior to the await.
			expect(runCount).withContext('e').toBe(3)

			// Double check just in case (the wrong implementation would make it
			// skip two microtasks before running).
			await Promise.resolve()
			expect(runCount).withContext('f').toBe(3)
		})
	})

	describe('@reactive, @signal, and reactify', () => {
		it('does not prevent superclass constructor from receiving subclass constructor args', () => {
			@reactive
			class Insect {
				constructor(public result: number) {}
			}

			class Butterfly extends Insect {
				constructor(arg: number) {
					super(arg * 2)
				}
			}

			const b = new Butterfly(4)

			expect(b.result).toBe(8)
		})

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
					signalify(this, ['colors', 'wingSize'])
				}
			}

			const b = new Butterfly()

			testButterflyProps(b)
		})

		it('makes class properties reactive, with properties defined in the constructor', () => {
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

					signalify(this, ['colors', 'wingSize'])
				}
			}

			const b = new Butterfly()

			testButterflyProps(b)
		})

		it('makes class properties reactive, using only class decorator, specified via static prop', () => {
			@reactive
			class Butterfly {
				static signalProperties = ['colors', 'wingSize']

				colors = 3
				_wingSize = 2

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

		it('makes class properties reactive, using only class decorator, specified via static prop, properties defined in the constructor', () => {
			@reactive
			class Butterfly {
				static signalProperties = ['colors', 'wingSize']

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
				}
			}

			const b = new Butterfly()
			testButterflyProps(b)
		})

		it('makes class properties reactive, not using any decorators, specified via static prop', () => {
			class Butterfly {
				static signalProperties = ['colors', 'wingSize']

				colors = 3
				_wingSize = 2

				get wingSize() {
					return this._wingSize
				}
				set wingSize(s: number) {
					this._wingSize = s
				}

				constructor() {
					signalify(this, Butterfly)
				}
			}

			const b = new Butterfly()
			testButterflyProps(b)
		})

		it('makes class properties reactive, not using any decorators, specified via static prop, properties defined in the constructor', () => {
			class Butterfly {
				static signalProperties = ['colors', 'wingSize']

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

					signalify(this, Butterfly)
					this.colors
					signalify(this, ['colors'])
				}
			}

			const b = new Butterfly()
			testButterflyProps(b)
		})

		it('can be used on a function-style class, with properties in the constructor', () => {
			function Butterfly() {
				// @ts-ignore
				this.colors = 3
				// @ts-ignore
				this._wingSize = 2

				// @ts-ignore
				signalify(this, Butterfly)
			}

			Butterfly.signalProperties = ['colors', 'wingSize']

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

		it('can be used on a function-style class, with properties on the prototype, reactify with static signalProperties in constructor', () => {
			function Butterfly() {
				// @ts-ignore
				signalify(this, Butterfly)
			}

			Butterfly.signalProperties = ['colors', 'wingSize']

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

			// @ts-ignore
			const b = new Butterfly()
			testButterflyProps(b)
		})

		it('can be used on a function-style class, with properties on the prototype, reactify with static signalProperties on the prototype', () => {
			function Butterfly() {}

			Butterfly.signalProperties = ['colors', 'wingSize']

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

			// @ts-ignore
			signalify(Butterfly.prototype, Butterfly)

			// @ts-ignore
			const b = new Butterfly()
			testButterflyProps(b)
		})

		it('can be used on a function-style class, with properties on the prototype, reactify with specific props in constructor', () => {
			function Butterfly() {
				// @ts-ignore
				signalify(this, ['colors', 'wingSize'])
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

			// @ts-ignore
			const b = new Butterfly()
			testButterflyProps(b)
		})

		it('can be used on a function-style class, with properties on the prototype, reactify with specific props on the prototype', () => {
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

			signalify(Butterfly.prototype, ['colors', 'wingSize'])

			// @ts-ignore
			const b = new Butterfly()
			testButterflyProps(b)
		})

		it('can be used on a function-style class, with properties in the constructor, reactive applied to constructor', () => {
			let Butterfly = function Butterfly() {
				// @ts-ignore
				this.colors = 3
				// @ts-ignore
				this._wingSize = 2
			}

			// @ts-ignore
			Butterfly.signalProperties = ['colors', 'wingSize']

			Butterfly.prototype = {
				get wingSize() {
					return this._wingSize
				},
				set wingSize(s: number) {
					this._wingSize = s
				},
			}

			Butterfly = reactive(Butterfly)

			// @ts-ignore
			const b = new Butterfly()
			testButterflyProps(b)
		})

		it('can be used on a function-style class, with properties on the prototype, reactive applied to constructor', () => {
			let Butterfly = function Butterfly() {}

			// @ts-ignore
			Butterfly.signalProperties = ['colors', 'wingSize']

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

			Butterfly = reactive(Butterfly)

			// @ts-ignore
			const b = new Butterfly()
			testButterflyProps(b)
		})

		it('can be used on a function-style class, with properties in the constructor, reactive applied to specific prototype properties', () => {
			let Butterfly = function Butterfly() {
				// @ts-ignore
				this.colors = 3
				// @ts-ignore
				this._wingSize = 2
			}

			// @ts-ignore
			Butterfly.signalProperties = ['colors', 'wingSize']

			Butterfly.prototype = {
				get wingSize() {
					return this._wingSize
				},
				set wingSize(s: number) {
					this._wingSize = s
				},
			}

			signal(Butterfly.prototype, 'colors')
			signal(Butterfly.prototype, 'wingSize')
			Butterfly = reactive(Butterfly)

			// @ts-ignore
			const b = new Butterfly()
			testButterflyProps(b)
		})

		it('can be used on a function-style class, with properties on the prototype, reactive applied to specific prototype properties', () => {
			let Butterfly = function Butterfly() {}

			// @ts-ignore
			Butterfly.signalProperties = ['colors', 'wingSize']

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

			signal(Butterfly.prototype, 'colors')
			signal(Butterfly.prototype, 'wingSize')
			Butterfly = reactive(Butterfly)

			// @ts-ignore
			const b = new Butterfly()
			testButterflyProps(b)
		})
	})
})

function testButterflyProps(b: {colors: number; wingSize: number; _wingSize: number}) {
	let count = 0

	createRoot(() => {
		createComputed(() => {
			b.colors
			b.wingSize
			count++
		})
	})

	expect(b.colors).toBe(3, 'initial colors value')
	expect(b.wingSize).toBe(2, 'initial wingSize value')
	expect(b._wingSize).toBe(2, 'ensure the original accessor works')
	expect(count).toBe(1, 'Should be reactive')

	b.colors++

	expect(b.colors).toBe(4, 'incremented colors value')
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
	num3.set() // ok, accepts undefined

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
	bool2.set() // ok, accepts undefined

	const func = createSignalObject(() => 1)
	// @ts-expect-error 1 is not assignable to function (no overload matches)
	func.set(() => 1)
	func.set(() => (): 1 => 1) // ok, set the value to a function
	const fn: () => 1 = func.get() // ok, returns function value
	fn
	const n5: 1 = func.get()()
	n5

	const func2 = createSignalObject<() => number>(() => 1)
	// @ts-expect-error number is not assignable to function (no overload matches)
	func2.set(() => 1)
	func2.set(() => () => 1) // ok, set the value to a function
	const fn2: () => number = func2.get() // ok, returns function value
	fn2
	const n6: number = func2.get()()
	n6

	const stringOrFunc1 = createSignalObject<(() => number) | string>('')
	// @ts-expect-error number not assignable to string | (()=>number) | undefined
	stringOrFunc1.set(() => 1)
	const sf1: () => number = stringOrFunc1.set(() => () => 1)
	sf1
	const sf2: string = stringOrFunc1.set('oh yeah')
	sf2
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
	// @ts-expect-error number not assignable to string | (()=>number) | undefined
	stringOrFunc2.set(() => 1)
	const sf9: () => number = stringOrFunc2.set(() => () => 1)
	sf9
	const sf10: string = stringOrFunc2.set('oh yeah')
	sf10
	const sf11: string = stringOrFunc2.set(() => 'oh yeah')
	sf11
	const sf12: undefined = stringOrFunc2.set()
	sf12
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
