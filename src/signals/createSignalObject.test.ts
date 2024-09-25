import {createSignalObject} from './createSignalObject.js'

describe('classy-solid', () => {
	describe('createSignalObject()', () => {
		it('has gettable and settable values via .get and .set methods', () => {
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
})

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
