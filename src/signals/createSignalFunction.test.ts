import {createSignalFunction} from './createSignalFunction.js'

describe('classy-solid', () => {
	describe('createSignalFunction()', () => {
		it('has gettable and settable values via a single overloaded function', () => {
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

		it('works with function values', () => {
			const f1 = () => 123
			const func = createSignalFunction(f1)

			expect(func()).toBe(f1)

			const f2 = () => 456
			func(() => f2)

			expect(func()).toBe(f2)
		})
	})
})

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
