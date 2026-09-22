import {createEffect, batch, createSignal} from 'solid-js'
import {signal} from './signal.js'
import {memo} from './memo.js'
import {effect, startEffects, stopEffects} from './effect.js'

describe('classy-solid', () => {
	describe('@memo decorator', () => {
		it('creates a readonly memo via getter', () => {
			class Example {
				@signal a = 1
				@signal b = 2

				@memo get sum2() {
					return this.a + this.b
				}
			}

			const ex = new Example()
			let count = 0
			let lastSum = 0

			createEffect(() => {
				lastSum = ex.sum2
				count++
			})

			expect(ex.sum2).toBe(3)
			expect(count).toBe(1)

			ex.a = 5
			expect(ex.sum2).toBe(7)
			expect(lastSum).toBe(7)
			expect(count).toBe(2)

			// This should not trigger the effect since the computed value doesn't change (still 7)
			batch(() => {
				ex.a = 3
				ex.b = 4
			})

			expect(ex.sum2).toBe(7)
			expect(lastSum).toBe(7)
			expect(count).toBe(2) // count should still be 2, not 3

			// Readonly memo cannot be set - should throw in strict mode
			expect(() => {
				// @ts-expect-error - intentionally setting readonly property
				ex.sum2 = 20
			}).toThrow()
		})

		it('creates a writable memo via getter+setter', () => {
			class Example {
				@signal a = 1
				@signal b = 2

				@memo get sum2() {
					return this.a + this.b
				}
				@memo set sum2(_val: number) {}
			}

			const ex = new Example()
			let count = 0
			let lastSum = 0

			createEffect(() => {
				lastSum = ex.sum2
				count++
			})

			expect(ex.sum2).toBe(3)
			expect(count).toBe(1)

			ex.a = 5
			expect(ex.sum2).toBe(7)
			expect(lastSum).toBe(7)
			expect(count).toBe(2)

			// This should not trigger the effect since the computed value doesn't change (still 7)
			batch(() => {
				ex.a = 3
				ex.b = 4
			})

			expect(ex.sum2).toBe(7)
			expect(lastSum).toBe(7)
			expect(count).toBe(2) // count should still be 2, not 3

			// Writable memo can be set directly
			ex.sum2 = 20
			expect(ex.sum2).toBe(20)
			expect(lastSum).toBe(20)
			expect(count).toBe(3)
		})

		it('creates a readonly memo via accessor function value', () => {
			class Example {
				@signal a = 1
				@signal b = 2

				@memo accessor sum3 = () => this.a + this.b
			}

			const ex = new Example()
			let runs = 0
			let lastSum = 0

			createEffect(() => {
				lastSum = ex.sum3()
				runs++
			})

			expect(ex.sum3()).toBe(3)
			expect(runs).toBe(1)

			ex.a = 5
			expect(ex.sum3()).toBe(7)
			expect(lastSum).toBe(7)
			expect(runs).toBe(2)

			// This should not trigger the effect since the computed value doesn't change (still 7)
			batch(() => {
				ex.a = 3
				ex.b = 4
			})

			expect(ex.sum3()).toBe(7)
			expect(lastSum).toBe(7)
			expect(runs).toBe(2) // count should still be 2, not 3

			// @ts-expect-error Readonly memo cannot be set - should throw
			expect(() => ex.sum3(20)).toThrow()
		})

		it('creates a writable memo via accessor function value', () => {
			class Example {
				@signal a = 1
				@signal b = 2

				@memo accessor sum3 = (_val?: number) => this.a + this.b
			}

			const ex = new Example()
			let count = 0
			let lastSum = 0

			createEffect(() => {
				lastSum = ex.sum3()
				count++
			})

			expect(ex.sum3()).toBe(3)
			expect(count).toBe(1)

			ex.a = 5
			expect(ex.sum3()).toBe(7)
			expect(lastSum).toBe(7)
			expect(count).toBe(2)

			// This should not trigger the effect since the computed value doesn't change (still 7)
			batch(() => {
				ex.a = 3
				ex.b = 4
			})

			expect(ex.sum3()).toBe(7)
			expect(lastSum).toBe(7)
			expect(count).toBe(2) // count should still be 2, not 3

			// Writable memo can be set directly
			ex.sum3(20)
			expect(ex.sum3()).toBe(20)
			expect(lastSum).toBe(20)
			expect(count).toBe(3)
		})

		it('creates a readonly memo via method', () => {
			class Example {
				@signal a = 1
				@signal b = 2

				@memo sum4() {
					return this.a + this.b
				}
			}

			const ex = new Example()
			let count = 0
			let lastSum = 0

			createEffect(() => {
				lastSum = ex.sum4()
				count++
			})

			expect(ex.sum4()).toBe(3)
			expect(count).toBe(1)

			ex.a = 5
			expect(ex.sum4()).toBe(7)
			expect(lastSum).toBe(7)
			expect(count).toBe(2)

			// This should not trigger the effect since the computed value doesn't change (still 7)
			batch(() => {
				ex.a = 3
				ex.b = 4
			})

			expect(ex.sum4()).toBe(7)
			expect(lastSum).toBe(7)
			expect(count).toBe(2) // count should still be 2, not 3

			// Readonly memo cannot be set - should throw
			expect(() => {
				// @ts-expect-error - intentionally setting readonly memo
				ex.sum4(20)
			}).toThrow()
		})

		it('creates a writable memo via method', () => {
			class Example {
				@signal a = 1
				@signal b = 2

				@memo sum4(_val?: number) {
					return this.a + this.b
				}
			}

			const ex = new Example()
			let count = 0
			let lastSum = 0

			createEffect(() => {
				lastSum = ex.sum4()
				count++
			})

			expect(ex.sum4()).toBe(3)
			expect(count).toBe(1)

			ex.a = 5
			expect(ex.sum4()).toBe(7)
			expect(lastSum).toBe(7)
			expect(count).toBe(2)

			// This should not trigger the effect since the computed value doesn't change (still 7)
			batch(() => {
				ex.a = 3
				ex.b = 4
			})

			expect(ex.sum4()).toBe(7)
			expect(lastSum).toBe(7)
			expect(count).toBe(2) // count should still be 2, not 3

			// Writable memo can be set directly
			ex.sum4(20)
			expect(ex.sum4()).toBe(20)
			expect(lastSum).toBe(20)
			expect(count).toBe(3)
		})

		it('memoizes complex computations and only re-runs when dependencies change', () => {
			class Calculator {
				computeCount = 0
				@signal x = 10
				@signal y = 5

				@memo get result() {
					this.computeCount++
					return this.x * 2 + this.y
				}
			}

			const calc = new Calculator()

			expect(calc.result).toBe(25)
			expect(calc.computeCount).toBe(1)

			// Reading again should not re-compute
			expect(calc.result).toBe(25)
			expect(calc.computeCount).toBe(1)

			// Changing a dependency should trigger recomputation
			calc.x = 20
			expect(calc.result).toBe(45)
			expect(calc.computeCount).toBe(2)

			// Reading again should not re-compute
			expect(calc.result).toBe(45)
			expect(calc.computeCount).toBe(2)
		})

		it('works with multiple memo properties', () => {
			class MultiMemo {
				@signal value = 10

				@memo double() {
					return this.value * 2
				}
				@memo get triple() {
					return this.value * 3
				}
				@memo accessor quadruple = () => this.value * 4
			}

			const mm = new MultiMemo()
			let doubleCount = 0
			let tripleCount = 0
			let quadCount = 0

			createEffect(() => {
				mm.double()
				doubleCount++
			})
			createEffect(() => {
				mm.triple
				tripleCount++
			})
			createEffect(() => {
				mm.quadruple()
				quadCount++
			})

			expect(mm.double()).toBe(20)
			expect(mm.triple).toBe(30)
			expect(mm.quadruple()).toBe(40)
			expect(doubleCount).toBe(1)
			expect(tripleCount).toBe(1)
			expect(quadCount).toBe(1)

			mm.value = 5
			expect(mm.double()).toBe(10)
			expect(mm.triple).toBe(15)
			expect(mm.quadruple()).toBe(20)
			expect(doubleCount).toBe(2)
			expect(tripleCount).toBe(2)
			expect(quadCount).toBe(2)
		})

		it('handles memo depending on other memos', () => {
			class ChainedMemo {
				@signal base = 2

				@memo get squared() {
					return this.base * this.base
				}

				@memo get cubed() {
					return this.squared * this.base
				}
			}

			const cm = new ChainedMemo()
			let count = 0

			createEffect(() => {
				cm.cubed
				count++
			})

			expect(cm.squared).toBe(4)
			expect(cm.cubed).toBe(8)
			expect(count).toBe(1)

			cm.base = 3
			expect(cm.squared).toBe(9)
			expect(cm.cubed).toBe(27)
			expect(count).toBe(2)
		})

		it('correctly handles writable getter+setter memo overriding explicit value', () => {
			class WritableOverride {
				@signal a = 5
				@signal b = 10

				@memo get sum() {
					return this.a + this.b
				}
				@memo set sum(_val: number) {}
			}

			const wo = new WritableOverride()
			let count = 0
			let lastValue = 0

			createEffect(() => {
				lastValue = wo.sum
				count++
			})

			expect(wo.sum).toBe(15)
			expect(count).toBe(1)
			expect(lastValue).toBe(15)

			// Override with direct value
			wo.sum = 100
			expect(wo.sum).toBe(100)
			expect(count).toBe(2)
			expect(lastValue).toBe(100)

			// Changing dependencies should still work after override
			wo.a = 20
			// The memo should now compute based on signals again
			expect(wo.sum).toBe(30) // 20 + 10
			expect(count).toBe(3)
			expect(lastValue).toBe(30)
		})

		it('correctly handles writable accessor memo overriding explicit value', () => {
			class WritableOverride {
				@signal a = 5
				@signal b = 10

				@memo accessor sum = (_val?: number) => this.a + this.b
			}

			const wo = new WritableOverride()
			let count = 0
			let lastValue = 0

			createEffect(() => {
				lastValue = wo.sum()
				count++
			})

			expect(wo.sum()).toBe(15)
			expect(count).toBe(1)
			expect(lastValue).toBe(15)

			// Override with direct value
			wo.sum(100)
			expect(wo.sum()).toBe(100)
			expect(count).toBe(2)
			expect(lastValue).toBe(100)

			// Changing dependencies should still work after override
			wo.a = 20
			// The memo should now compute based on signals again
			expect(wo.sum()).toBe(30) // 20 + 10
			expect(count).toBe(3)
			expect(lastValue).toBe(30)
		})

		it('correctly handles writable method memo overriding explicit value', () => {
			class WritableOverride {
				@signal a = 5
				@signal b = 10

				@memo sum(_val?: number) {
					return this.a + this.b
				}
			}

			const wo = new WritableOverride()
			let count = 0
			let lastValue = 0

			createEffect(() => {
				lastValue = wo.sum()
				count++
			})

			expect(wo.sum()).toBe(15)
			expect(count).toBe(1)
			expect(lastValue).toBe(15)

			// Override with direct value
			wo.sum(100)
			expect(wo.sum()).toBe(100)
			expect(count).toBe(2)
			expect(lastValue).toBe(100)

			// Changing dependencies should still work after override
			wo.a = 20
			// The memo should now compute based on signals again
			expect(wo.sum()).toBe(30) // 20 + 10
			expect(count).toBe(3)
			expect(lastValue).toBe(30)
		})

		it('handles memo with no dependencies', () => {
			class ConstantMemo {
				@memo get constant() {
					return 42
				}
			}

			const cm = new ConstantMemo()
			let count = 0

			createEffect(() => {
				cm.constant
				count++
			})

			expect(cm.constant).toBe(42)
			expect(count).toBe(1)

			// Reading again should not trigger effect
			const val = cm.constant
			expect(val).toBe(42)
			expect(count).toBe(1)
		})

		it('supports private getter/setters', () => {
			class Example {
				@signal a = 1
				@signal b = 2

				@memo get #sumPrivate() {
					return this.a + this.b
				}
				@memo set #sumPrivate(_val: number) {}

				get sum() {
					return this.#sumPrivate
				}
				set sum(val) {
					this.#sumPrivate = val
				}
			}

			const ex = new Example()
			let count = 0
			let lastSum = 0

			createEffect(() => {
				lastSum = ex.sum
				count++
			})

			expect(lastSum).toBe(3)
			expect(count).toBe(1)

			ex.a = 5
			expect(lastSum).toBe(7)
			expect(count).toBe(2)

			batch(() => {
				ex.a = 3
				ex.b = 4
			})

			expect(lastSum).toBe(7)
			expect(count).toBe(2) // should not run because sum didn't change

			ex.sum = 20
			expect(lastSum).toBe(20)
			expect(count).toBe(3)
		})

		// This is undocumented, but helps us get set up for concise accessors once that syntax lands.
		it('supports private auto accessors', () => {
			class Example {
				@signal a = 1
				@signal b = 2

				// Private auto-accessor whose value is the (writable, arity > 0)
				// memo function. Read via `this.#sumPrivate()`, write via
				// `this.#sumPrivate(val)`.
				@memo accessor #sumPrivate = (_val?: number) => this.a + this.b

				get sum() {
					return this.#sumPrivate()
				}
				set sum(val) {
					this.#sumPrivate(val)
				}
			}

			const ex = new Example()
			let count = 0
			let lastSum = 0

			createEffect(() => {
				lastSum = ex.sum
				count++
			})

			expect(lastSum).toBe(1 + 2)
			expect(count).toBe(1)

			ex.a = 5
			expect(lastSum).toBe(5 + 2)
			expect(count).toBe(2)

			batch(() => {
				ex.a = 3
				ex.b = 4
			})

			expect(lastSum).toBe(7)
			expect(count).toBe(2) // should not run because sum didn't change

			ex.sum = 20
			expect(lastSum).toBe(20)
			expect(count).toBe(3)
		})

		it('supports private methods', () => {
			class Example {
				@signal a = 1
				@signal b = 2

				@memo #sumPrivate(_val?: number) {
					return this.a + this.b
				}

				get sum() {
					return this.#sumPrivate()
				}
				set sum(val) {
					this.#sumPrivate(val)
				}
			}

			const ex = new Example()
			let count = 0
			let lastSum = 0

			createEffect(() => {
				lastSum = ex.sum
				count++
			})

			expect(lastSum).toBe(1 + 2)
			expect(count).toBe(1)

			ex.a = 5
			expect(lastSum).toBe(5 + 2)
			expect(count).toBe(2)

			batch(() => {
				ex.a = 3
				ex.b = 4
			})

			expect(lastSum).toBe(7)
			expect(count).toBe(2) // should not run because sum didn't change

			ex.sum = 20
			expect(lastSum).toBe(20)
			expect(count).toBe(3)
		})

		describe('laziness and lifecycle', () => {
			it('reads a regular field declared after the last @signal field (field-order case)', () => {
				class Foo {
					@signal a = 1
					runs = 0 // declared AFTER the last @signal; was `undefined` under eager memos

					@memo get doubled() {
						this.runs++
						return this.a * 2
					}
				}

				const f = new Foo()
				expect(f.runs).toBe(0) // not computed at construction
				expect(f.doubled).toBe(2)
				expect(f.runs).toBe(1)
				expect(f.doubled).toBe(2)
				expect(f.runs).toBe(1) // cached
			})

			it('does not run the memo body until first read (all forms)', () => {
				let g = 0
				let m = 0
				let acc = 0

				class Foo {
					@signal a = 1

					@memo get getter() {
						g++
						return this.a
					}
					@memo method() {
						m++
						return this.a
					}
					@memo accessor accessorMemo = () => {
						acc++
						return this.a
					}
				}

				const f = new Foo()
				expect([g, m, acc]).toEqual([0, 0, 0])
				f.getter
				f.method()
				f.accessorMemo()
				expect([g, m, acc]).toEqual([1, 1, 1])
			})

			it('is owned by the instance, not by the external effect that first reads it', () => {
				const [trigger, setTrigger] = createSignal(0)
				let memoRuns = 0
				let effectRuns = 0

				class Foo {
					@signal a = 1
					@memo get doubled() {
						memoRuns++
						return this.a * 2
					}
				}

				const f = new Foo()

				createEffect(() => {
					trigger()
					effectRuns++
					f.doubled // first read is INSIDE this effect
				})

				expect(memoRuns).toBe(1)
				setTrigger(1) // effect re-runs; must not dispose the memo
				expect(effectRuns).toBe(2)
				expect(memoRuns).toBe(1)
				f.a = 2 // memo still alive and still notifies the effect
				expect(memoRuns).toBe(2)
				expect(effectRuns).toBe(3)
			})

			it('stops and restarts with stopEffects/startEffects, keeping dependents working', () => {
				let memoRuns = 0
				let last = 0

				class Foo {
					@signal a = 1
					@memo get doubled() {
						memoRuns++
						return this.a * 2
					}
				}

				const f = new Foo()
				createEffect(() => {
					last = f.doubled
				})

				expect(last).toBe(2)
				expect(memoRuns).toBe(1)

				stopEffects(f)
				f.a = 2
				// The memo is disposed and the dependent effect's only dependency
				// was the memo, so it is not notified while stopped...
				expect(last).toBe(2)
				expect(memoRuns).toBe(1)
				// ...but a direct read still computes a fresh value.
				expect(f.doubled).toBe(4)
				expect(memoRuns).toBe(2)

				startEffects(f)
				// Restart bump re-runs the dependent once with a fresh memo.
				expect(last).toBe(4)
				f.a = 3
				expect(last).toBe(6)
			})

			it('writes to a writable memo before any read work', () => {
				class Foo {
					@signal a = 1
					@memo get val() {
						return this.a * 10
					}
					@memo set val(_v: number) {}
				}

				const f = new Foo()
				f.val = 99 // no read yet
				expect(f.val).toBe(99)
				f.a = 2
				expect(f.val).toBe(20)
			})

			it('README field-order gotcha: an eager @effect reading a memo before a later regular field sees it uninitialized', () => {
				let seen: unknown = 'not-run'
				class Example {
					@signal a = 1
					runs = 0
					@memo get doubled() {
						this.runs++
						return this.a * 2
					}
					@effect log() {
						seen = this.runs // captured at the effect's first run, at `a`'s initializer
						this.doubled
					}
				}
				const o = new Example()
				expect(seen).toBe(undefined)
				// `this.runs++` ran on undefined (NaN), then the `runs = 0`
				// initializer overwrote it — the count is lost.
				expect(o.runs).toBe(0)
			})

			it('README field-order fix, option 1: regular fields before @signal fields', () => {
				let seen: unknown = 'not-run'
				class Example {
					runs = 0
					@signal a = 1
					@memo get doubled() {
						this.runs++
						return this.a * 2
					}
					@effect log() {
						this.doubled
						seen = this.runs
					}
				}
				new Example()
				expect(seen).toBe(1)
			})

			it('README field-order fix, option 2: trailing dummy @signal', () => {
				let seen: unknown = 'not-run'
				class Example {
					@signal a = 1
					runs = 0
					@memo get doubled() {
						this.runs++
						return this.a * 2
					}
					@effect log() {
						this.doubled
						seen = this.runs
					}
					@signal __dummy__init__ = null
				}
				new Example()
				expect(seen).toBe(1)
			})

			it('throws when read before its class finished initializing', () => {
				class Foo {
					// Field initializer reads the memo before the last @signal field
					// (`a`, below) has initialized this class's members.
					early = this.doubled

					@signal a = 1

					@memo get doubled() {
						return this.a * 2
					}
				}

				expect(() => new Foo()).toThrow(
					'@memo "doubled" on Foo was read before its class finished initializing (before the last @signal field).',
				)
			})

			it('does not throw when a constructor reads a memo after all @signal fields', () => {
				class Foo {
					@signal a = 1
					fromCtor = 0

					@memo get doubled() {
						return this.a * 2
					}

					constructor() {
						this.fromCtor = this.doubled
					}
				}

				const f = new Foo()
				expect(f.fromCtor).toBe(2)
				f.a = 5
				expect(f.doubled).toBe(10)
			})

			it('does not throw when a subclass field initializer reads a base class memo', () => {
				class Base {
					@signal a = 1
					@memo get doubled() {
						return this.a * 2
					}
				}

				class Sub extends Base {
					fromBase = this.doubled // Base already finalized before Sub's fields run
					@signal b = 2
				}

				const s = new Sub()
				expect(s.fromBase).toBe(2)
			})

			it('works in a class with only @memo and @signal getter/setters (no signal fields, no effects)', () => {
				class Foo {
					#a = 1
					@signal get a() {
						return this.#a
					}
					@signal set a(v) {
						this.#a = v
					}

					@memo get doubled() {
						return this.a * 2
					}
				}

				const f = new Foo()
				let last = 0
				createEffect(() => {
					last = f.doubled
				})
				expect(last).toBe(2)
				f.a = 3
				expect(last).toBe(6)
			})
		})

		describe('subclass memo overriding/extending', () => {
			it('supports subclass memo extending base memo (getter)', () => {
				class Base {
					@signal a = 1
					@memo get baseVal() {
						return this.a + 1
					}
				}

				class Sub extends Base {
					@memo override get baseVal() {
						return super.baseVal + 1 // extend
					}
				}

				const s = new Sub()
				let runs = 0
				let last = 0

				createEffect(() => {
					runs++
					last = s.baseVal
				})

				expect(last).toBe(1 + 1 + 1)
				expect(runs).toBe(1)

				s.a = 5
				expect(last).toBe(5 + 1 + 1)
				expect(runs).toBe(2)
			})

			it('supports subclass memo overriding base memo (getter no super)', () => {
				class Base {
					@signal a = 1
					@memo get val() {
						return this.a + 1
					}
				}

				class Sub extends Base {
					@memo override get val() {
						return this.a * 2 // override
					}
				}

				const s = new Sub()
				let runs = 0
				let last = 0

				createEffect(() => {
					runs++
					last = s.val
				})

				expect(last).toBe(1 * 2)
				expect(runs).toBe(1)

				s.a = 5
				expect(last).toBe(5 * 2)
				expect(runs).toBe(2)
			})

			it('supports getter override with no super', () => {
				const [a, setA] = createSignal(10)
				let baseRuns = 0
				let subRuns = 0

				class Base {
					@memo get val() {
						baseRuns++
						return a() + 1
					}
				}

				class Sub extends Base {
					@memo override get val() {
						subRuns++
						return a() + 10
					}
				}

				const o = new Sub()
				let effectRuns = 0
				let effectVal = 0

				createEffect(() => {
					effectRuns++
					effectVal = o.val
				})

				expect(effectVal).toBe(10 + 10)
				expect(baseRuns).toBe(0)
				expect(subRuns).toBe(1)
				expect(effectRuns).toBe(1)

				setA(20)
				expect(effectVal).toBe(20 + 10)
				expect(baseRuns).toBe(0)
				expect(subRuns).toBe(2)
				expect(effectRuns).toBe(2)
			})

			it('supports multi-level getter extension with super', () => {
				const [a, setA] = createSignal(10)
				let baseRuns = 0
				let midRuns = 0
				let subRuns = 0

				class Base {
					@memo get val() {
						baseRuns++
						return a() + 1
					}
				}

				class Mid extends Base {
					@memo override get val() {
						midRuns++
						return super.val + 10
					}
				}

				class Sub extends Mid {
					@memo override get val() {
						subRuns++
						return super.val + 100
					}
				}

				const o = new Sub()
				let effectRuns = 0
				let effectVal = 0

				createEffect(() => {
					effectRuns++
					effectVal = o.val
				})

				expect(effectVal).toBe(10 + 1 + 10 + 100)
				expect(baseRuns).toBe(1)
				expect(midRuns).toBe(1)
				expect(subRuns).toBe(1)
				expect(effectRuns).toBe(1)

				setA(20)
				expect(effectVal).toBe(20 + 1 + 10 + 100)
				expect(baseRuns).toBe(2)
				expect(midRuns).toBe(2)
				expect(subRuns).toBe(2)
				expect(effectRuns).toBe(2)
			})

			it('supports subclass memo method extension with super', () => {
				let baseRuns = 0

				class BaseM {
					@signal a = 1
					@memo val() {
						baseRuns++
						return this.a + 1
					}
				}

				let subRuns = 0

				class SubM extends BaseM {
					@memo override val() {
						subRuns++
						return super.val() + 2
					}
				}

				const s = new SubM()
				let effectRuns = 0
				let last = 0

				createEffect(() => {
					effectRuns++
					last = s.val()
				})

				expect(last).toBe(1 + 1 + 2)
				expect(baseRuns).toBe(1)
				expect(subRuns).toBe(1)
				expect(effectRuns).toBe(1)

				s.a = 5
				expect(last).toBe(5 + 1 + 2)
				expect(baseRuns).toBe(2)
				expect(subRuns).toBe(2)
				expect(effectRuns).toBe(2)
			})

			it('supports subclass memo method override with no super', () => {
				let baseRuns = 0
				let subRuns = 0

				class BaseM {
					@signal a = 1
					@memo val() {
						baseRuns++
						return this.a + 1
					}
				}

				class SubM extends BaseM {
					@memo override val() {
						subRuns++
						return this.a + 2
					}
				}

				const s = new SubM()
				let effectRuns = 0
				let last = 0

				createEffect(() => {
					effectRuns++
					last = s.val()
				})

				expect(last).toBe(1 + 2)
				expect(baseRuns).toBe(0)
				expect(subRuns).toBe(1)
				expect(effectRuns).toBe(1)

				s.a = 5
				expect(last).toBe(5 + 2)
				expect(baseRuns).toBe(0)
				expect(subRuns).toBe(2)
				expect(effectRuns).toBe(2)
			})

			it('supports subclass memo auto accessor extension with super', () => {
				let baseRuns = 0
				let subRuns = 0

				class BaseFO {
					@signal a = 1
					@memo accessor val = () => {
						baseRuns++
						return this.a + 1
					}
				}

				class SubFO extends BaseFO {
					@memo override accessor val = () => {
						subRuns++
						return super.val() * 3
					}
				}

				const s = new SubFO()
				let effectRuns = 0
				let last = 0

				createEffect(() => {
					effectRuns++
					last = s.val()
				})

				expect(last).toBe((1 + 1) * 3)
				expect(baseRuns).toBe(1)
				expect(subRuns).toBe(1)
				expect(effectRuns).toBe(1)

				s.a = 4
				expect(last).toBe((4 + 1) * 3)
				expect(baseRuns).toBe(2)
				expect(subRuns).toBe(2)
				expect(effectRuns).toBe(2)
			})

			it('supports subclass memo auto accessor override with no super', () => {
				let baseRuns = 0
				let subRuns = 0

				class BaseFO {
					@signal a = 1
					@memo accessor val = () => {
						baseRuns++
						return this.a + 1
					}
				}

				class SubFO extends BaseFO {
					@memo override accessor val = () => {
						subRuns++
						return this.a * 3
					}
				}

				const s = new SubFO()
				let effectRuns = 0
				let last = 0

				createEffect(() => {
					effectRuns++
					last = s.val()
				})

				expect(last).toBe(1 * 3)
				expect(baseRuns).toBe(0)
				expect(subRuns).toBe(1)
				expect(effectRuns).toBe(1)

				s.a = 4
				expect(last).toBe(4 * 3)
				expect(baseRuns).toBe(0)
				expect(subRuns).toBe(2)
				expect(effectRuns).toBe(2)
			})
		})

		describe('invalid usage', () => {
			it('throws on non-function value', () => {
				class Base {
					// @ts-expect-error non-function value
					@memo accessor foo = 1
				}

				expect(() => new Base()).toThrow('memo value for "foo" is not a function: 1')
			})

			it('throws on @memo used on class field', () => {
				const [a] = createSignal(10)

				expect(() => {
					class InvalidMemo {
						// @ts-expect-error @memo not usable on fields
						@memo a = () => a()
					}
					new InvalidMemo()
				}).toThrow('@memo is not supported on class fields.')
			})

			it('throws on duplicate members', () => {
				const run = () => {
					class SuperDuper {
						// @ts-expect-error duplicate member
						@memo get dupe() {
							return 2
						}
						// @ts-expect-error duplicate member
						@memo get dupe() {
							return 3
						}
					}

					new SuperDuper()
				}

				// When compiling with Babel, decorators currently throw an error when applied onto multiple members of the same name.
				expect(run).toThrow('Decorating two elements with the same name (get dupe) is not supported yet')

				// When compiling with TypeScript, decorating duplicate members is allowed, and the last one wins.
				// expect(run).toThrow(
				// 	'@memo decorated member "dupe" has already been memoified. This can happen if there are duplicated class members.',
				// )

				// TODO ^ update Babel to latest in @lume/cli, see if decorators on duplicate members work in classy-solid
			})

			it('throws due to TDZ when accessing private fields defined after regular fields', () => {
				class Bar {
					@signal bar = 456

					#baz = 789

					@signal get baz() {
						return this.#baz
					}
					@signal set baz(v) {
						this.#baz = v
					}

					// This throws because #baz is used before its initialization
					// The ordering is:
					// 1. bar field initialized
					// 2. bar field runs finalizers because it is last in the ordering of extra initializers (so #baz is not initialized yet)
					// 3. During the logBar finalizer (executed in the bar extra initializer), the baz getter is accessed, which accesses #baz before it is initialized
					@effect logBar() {
						this.baz
					}
				}

				expect(() => new Bar()).toThrow('Cannot read private member #baz from an object whose class did not declare it')

				// To work around the problem, place private fields before regular fields:
				class Bar2 {
					#baz = 789

					@signal bar = 456

					@signal get baz() {
						return this.#baz
					}
					@signal set baz(v) {
						this.#baz = v
					}

					@effect logBar() {
						this.baz
					}
				}

				expect(() => new Bar2()).not.toThrow()
			})
		})
	})
})
