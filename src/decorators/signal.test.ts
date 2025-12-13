import {$PROXY, createEffect} from 'solid-js'
import {createMutable} from 'solid-js/store'
import {testButterflyProps} from '../index.test.js'
import {signal} from './signal.js'
import {signalify} from '../signals/signalify.js'
import type {ClassySolidMetadata} from './types.js'
import {isSignalGetter} from '../_state.js'
import {memo} from './memo.js'

describe('classy-solid', () => {
	describe('@signal decorator', () => {
		class Butterfly {
			@signal colors = 3

			#wingSize = 2

			// Stick this here to ensure that nested constructor doesn't
			// interfere with decorator behavior mid-way through initialization
			// of the wrapper parent class (tested with a subclass)
			child: Butterfly | null = this.constructor !== Butterfly ? new Butterfly() : null

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

		class Butterfly2 {
			@signal colors = 3
			@signal wingSize = 2
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
		}

		it('makes class fields reactive, using field/getter/setter decorators without class decorator', () => {
			const b = new Butterfly3()

			testButterflyProps(b)
		})

		class Butterfly4 {
			@signal colors = 3
			@signal accessor wingSize = 2
		}

		it('makes class fields reactive, using field/accessor decorators without class decorator', () => {
			const b = new Butterfly4()

			testButterflyProps(b)
		})

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

		it('allows overridden fields to work as expected', async () => {
			class Mid extends Butterfly {
				override colors = 0
			}

			// ensure subclass did not interfere with functionality of base class
			new Butterfly() // ensure first instantiation doesn't affect later ones
			const b0 = new Butterfly()
			testProp(b0, 'colors', 3, 4, true)
			expect(Object.getOwnPropertyDescriptor(b0, 'colors')?.get?.call(b0) === 4).toBe(true) // accessor descriptor

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
			class Insect {
				constructor(public double: number) {}
			}

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

		it('works with function values', () => {
			// This test ensures that functions are handled propertly, because
			// if passed without being wrapped to a signal setter it will be
			// called immediately with the previous value and be expected to
			// return a new value, instead of being set as the actual new value.

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

		it('prevents duplicate signals for any property', () => {
			class Insect {
				@signal venomous = 0

				@signal accessor legs = 6

				#eyes = 10
				@signal get eyes() {
					return this.#eyes
				}
				@signal set eyes(n) {
					this.#eyes = n
				}

				antennas = 0

				constructor() {
					// This should not add any extra signals for properties that
					// are already signalified by the @signal decorator
					signalify(this, 'venomous', 'legs', 'eyes', 'antennas')
				}
			}
			const i = new Insect()

			testNoDuplicateSignal(i, 'venomous')
			testNoDuplicateSignal(i, 'legs')
			testNoDuplicateSignal(i, 'eyes')
			testNoDuplicateSignal(i, 'antennas')

			function testNoDuplicateSignal(o: Insect, prop: keyof Insect) {
				let count = 0
				createEffect(() => {
					count++
					o[prop]
				})
				expect(count).toBe(1)
				o[prop]++
				expect(count).toBe(2) // it would be 3 if there were an extra signal
			}
		})

		it('throws on invalid usage', () => {
			expect(() => {
				class InvalidStatic {
					@signal static val = 1
				}
				new InvalidStatic()
			}).toThrowError('@signal is not supported on static fields yet.')

			expect(() => {
				class InvalidMethod {
					// @ts-expect-error type error because method is invalid
					@signal method() {
						return 1
					}
				}
				new InvalidMethod()
			}).toThrowError('The @signal decorator is only for use on fields, getters, setters, and auto accessors.')
		})

		it('no-ops with Solid proxies to avoid an unnecessary extra signal', () => {
			let plain!: Human
			let proxy!: Human

			class Human {
				constructor() {
					plain = this
					return (proxy = createMutable(this))
				}
			}

			let metadata!: ClassySolidMetadata

			const _signal: typeof signal = (_, context) => {
				metadata = context.metadata as ClassySolidMetadata
				return signal(_, context)
			}

			let memoRuns = 0

			class CoolKid extends Human {
				@_signal age = 3

				@memo get ageInDogYears() {
					memoRuns++
					return this.age * 7
				}
			}

			const kid = new CoolKid()

			// Verify we got a Solid Proxy.
			expect(plain === proxy).toBe(false)
			expect((plain as any)[$PROXY] === proxy).toBe(true)

			expect(metadata.classySolid_members!.find(m => m.name === 'age')!.applied.get(kid)).toBe(true)

			// Verify it there is not our own signal getter applied (it may be
			// the Solid Proxy's, or none, depending on how the Solid Proxy
			// implementation goes).
			const descriptor = Object.getOwnPropertyDescriptor(kid, 'age')
			const getter = descriptor!.get!
			expect(isSignalGetter.has(getter)).toBe(false)

			let count = 0
			createEffect(() => {
				count++
				kid.age
			})

			expect(count).toBe(1)
			expect(kid.age).toBe(3)
			// check that @memo still works with the Proxy
			expect(memoRuns).toBe(1)
			expect(kid.ageInDogYears).toBe(21)

			kid.age = 4

			expect(count).toBe(2)
			expect(kid.age).toBe(4)
			// check that @memo still works with the Proxy
			expect(memoRuns).toBe(2)
			expect(kid.ageInDogYears).toBe(28)
		})

		describe('subclass signal overriding/extending', () => {
			it('supports subclass signal field extending base signal field', () => {
				class Base {
					@signal val = 1
				}

				class Sub extends Base {
					// @ts-ignore this is valid in plain JS, TS complains about using field before initialization
					@signal override val = this.val + 1 // override field with initial value from base class
				}

				const s = new Sub()
				let count = 0
				createEffect(() => {
					count++
					s.val
				})

				expect(s.val).toBe(2)
				expect(count).toBe(1)

				s.val = 5
				expect(s.val).toBe(5)
				expect(count).toBe(2)
			})

			it('supports subclass signal auto accessor extending base signal auto accessor with super', () => {
				class Base {
					@signal accessor n = 1
				}

				class Sub extends Base {
					@signal override accessor n = super.n + 1 // initialize with initial super value
				}

				const s = new Sub()
				let count = 0
				createEffect(() => {
					count++
					s.n
				})

				expect(s.n).toBe(2)
				expect(count).toBe(1)

				s.n = 7
				expect(s.n).toBe(7)
				expect(count).toBe(2)
			})

			it('supports subclass signal getter/setter extending base signal getter/setter with super', () => {
				class Base {
					#n = 1
					@signal get n() {
						return this.#n
					}
					@signal set n(v: number) {
						this.#n = v
					}
				}

				class Sub extends Base {
					@signal override get n() {
						return super.n + 1 // extend read
					}
					@signal override set n(v: number) {
						super.n = v + 1 // extend write
					}
				}

				const s = new Sub()
				let count = 0
				let last = 0
				createEffect(() => {
					count++
					last = s.n
				})

				expect(last).toBe(1 + 1)
				expect(count).toBe(1)

				s.n = 10
				expect(last).toBe(10 + 1 + 1)
				expect(count).toBe(2)
			})

			it('supports multi-level signal getter/setter extension with super', () => {
				let runs = 0
				class Base {
					_val = 1
					@signal get val() {
						return this._val
					}
					@signal set val(v) {
						this._val = v
					}
				}
				class Mid extends Base {
					@signal override get val() {
						return super.val + 10
					}
					@signal override set val(v) {
						super.val = v - 10
					}
				}
				class Sub extends Mid {
					@signal override get val() {
						return super.val + 100
					}
					@signal override set val(v) {
						super.val = v - 100
					}
				}
				const o = new Sub()

				createEffect(() => {
					runs++
					o.val
				})

				expect(o._val).toBe(1)
				expect(o.val).toBe(1 + 10 + 100)
				expect(runs).toBe(1)

				o.val = 200
				expect(runs).toBe(2)
				expect(o._val).toBe(200 - 100 - 10)
				expect(o.val).toBe(90 + 10 + 100)
			})

			it('supports subclass signal getter/setter overriding base signal getter/setter without super', () => {
				class Base {
					#v = 1
					@signal get v() {
						return this.#v
					}
					@signal set v(x: number) {
						this.#v = x
					}
				}

				class Sub extends Base {
					#y = 100
					@signal override get v() {
						return this.#y
					}
					@signal override set v(x: number) {
						this.#y = x
					}
				}

				const s = new Sub()
				let count = 0
				createEffect(() => {
					s.v
					count++
				})

				expect(s.v).toBe(100)
				expect(count).toBe(1)

				s.v = 50
				expect(s.v).toBe(50)
				expect(count).toBe(2)
			})
		})

		describe('invalid usage', () => {
			it('throws on duplicate members', () => {
				const run = () => {
					class SuperDuper {
						@signal dupe = 0
						// @ts-expect-error duplicate member
						@signal dupe = 0
					}

					new SuperDuper()
				}

				// This one works the same way whether compiling with Babel or
				// TypeScript. See the same tests for @memo and @effect.
				expect(run).toThrow(
					'@signal decorated member "dupe" has already been signalified. This can happen if there are duplicated class members.',
				)
			})
		})
	})
})
