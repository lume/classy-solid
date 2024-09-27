import {createEffect} from 'solid-js'
import {testButterflyProps} from '../index.test.js'
import {reactive} from './reactive.js'
import {signal} from './signal.js'

describe('classy-solid', () => {
	describe('@reactive, @signal', () => {
		@reactive
		class Butterfly {
			@signal colors = 3

			#wingSize = 2

			@signal get wingSize() {
				return this.#wingSize
			}
			@signal set wingSize(s: number) {
				this.#wingSize = s
			}
		}

		it('makes class fields reactive, using class and field/getter/setter decorators', () => {
			const b = new Butterfly()

			testButterflyProps(b)
		})

		// @reactive
		class Butterfly2 {
			@signal colors = 3
			@signal wingSize = 2
			// @ts-ignore
			@signal #finalize
		}

		it('makes class fields reactive, using field decorators without class decorator', () => {
			const b = new Butterfly2()

			testButterflyProps(b)
		})

		class Butterfly3 {
			@signal colors = 3

			#wingSize = 2

			@signal get wingSize() {
				return this.#wingSize
			}
			@signal set wingSize(s: number) {
				this.#wingSize = s
			}

			// @ts-ignore
			@signal #finalize
		}

		it('makes class fields reactive, using field/getter/setter decorators without class decorator', () => {
			const b = new Butterfly3()

			testButterflyProps(b)
		})

		class Butterfly4 {
			@signal colors = 3
			@signal accessor wingSize = 2
			// @ts-ignore
			@signal #finalize
		}

		it('makes class fields reactive, using field/accessor decorators without class decorator', () => {
			const b = new Butterfly4()

			testButterflyProps(b)
		})

		@reactive
		class Butterfly5 {
			@signal colors = 3
			@signal accessor wingSize = 2
		}

		it('makes class fields reactive, using field/accessor decorators with class decorator', () => {
			const b = new Butterfly5()

			testButterflyProps(b)
		})

		class Butterfly6 {
			@signal accessor #colors = 3

			getColors() {
				return this.#colors
			}
			setColors(v: number) {
				return (this.#colors = v)
			}
		}

		it('makes private class auto accessor reactive', () => {
			const b = new Butterfly6()
			testPrivate(b)
		})

		class Butterfly7 {
			#_colors = 3

			@signal get #colors() {
				return this.#_colors
			}
			@signal set #colors(v: number) {
				this.#_colors = v
			}

			getColors() {
				return this.#colors
			}
			setColors(v: number) {
				return (this.#colors = v)
			}
		}

		it('makes private class getter/setter accessors reactive', () => {
			const b = new Butterfly7()
			testPrivate(b)
		})

		class Base {
			#colors = 3

			@signal get colors() {
				return this.#colors
			}
			@signal set colors(v: number) {
				this.#colors = v
			}
		}

		class Butterfly8 extends Base {
			#colors = 3

			@signal override get colors() {
				return this.#colors
			}
			@signal override set colors(v: number) {
				this.#colors = v
			}

			getColors() {
				return this.colors
			}
			setColors(v: number) {
				return (this.colors = v)
			}
		}

		it('makes overridden class getter/setter accessors reactive', () => {
			const b = new Butterfly8()
			testPrivate(b)
		})

		function testPrivate(b: Pick<Butterfly6, 'getColors' | 'setColors'>) {
			let count = 0

			createEffect(() => {
				b.getColors()
				count++
			})

			expect(b.getColors()).toBe(3)
			expect(count).toBe(1)

			b.setColors(5)
			expect(b.getColors()).toBe(5)
			expect(count).toBe(2)
		}

		const ensure = it

		ensure('overridden fields work as expected', async () => {
			class Mid extends Butterfly {
				override colors = 0
			}

			// ensure subclass did not interfere with functionality of base class
			const b0 = new Butterfly()
			testProp(b0, 'colors', 3, 4, true)
			expect(Object.getOwnPropertyDescriptor(b0, 'colors')?.get?.call(b0) === 4).toBe(true) // accessor descriptor

			@reactive
			class SubButterfly extends Mid {
				@signal override colors = 123
			}

			// ensure subclass did not interfere with functionality of base class
			const m = new Mid()
			testProp(m, 'colors', 0, 1, false)
			expect(Object.getOwnPropertyDescriptor(m, 'colors')?.value === 1).toBe(true) // value descriptor

			class SubSubButterfly extends SubButterfly {
				override colors = 456
			}

			const b = new SubButterfly()
			testButterflyProps(b, 123)

			const b2 = new SubSubButterfly()

			testProp(b2, 'colors', 456, 654, false)
		})

		function testProp<T extends object>(o: T, k: keyof T, startVal: any, newVal: any, reactive = true) {
			let count = 0

			createEffect(() => {
				o[k]
				count++
			})

			expect(o[k]).toBe(startVal)
			expect(count).toBe(1)

			o[k] = newVal // should not be a signal, should not trigger

			expect(o[k]).toBe(newVal)
			expect(count).toBe(reactive ? 2 : 1)
		}

		it('does not prevent superclass constructor from receiving subclass constructor args', () => {
			@reactive
			class Insect {
				constructor(public double: number) {}
			}

			@reactive
			class Butterfly extends Insect {
				@signal colors = 3

				#wingSize = 2

				@signal get wingSize() {
					return this.#wingSize
				}
				@signal set wingSize(s: number) {
					this.#wingSize = s
				}

				constructor(arg: number) {
					super(arg * 2)
				}
			}

			const b = new Butterfly(4)

			expect(b.double).toBe(8)
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
})
