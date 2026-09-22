import {batch, createEffect, createRoot, createSignal} from 'solid-js'
import {signalify} from './signalify.js'
import {memoify} from './memoify.js'
import {startEffects, stopEffects} from '../decorators/effect.js'
import {effect} from '../decorators/effect.js'
import {Effects} from '../mixins/Effectful.js'
import {effects__} from '../_state.js'

describe('classy-solid', () => {
	describe('memoify()', () => {
		it('returns the same object that was passed in', () => {
			const obj = {
				sum() {
					return 1
				},
			}
			const obj2 = memoify(obj, 'sum')
			expect(obj).toBe(obj2)
		})

		it('skips non-function properties in automatic mode', () => {
			const obj = {a: 1, b: 2}
			const result = memoify(obj)
			expect(Object.getOwnPropertyDescriptor(result, 'a')?.value).toBe(1)
			expect(Object.getOwnPropertyDescriptor(result, 'b')?.value).toBe(2)
		})

		it('skips non-function properties in explicit mode', () => {
			const obj = {a: 1, b: 2}
			const result = memoify(obj, 'a', 'b')
			expect(Object.getOwnPropertyDescriptor(result, 'a')?.value).toBe(1)
			expect(Object.getOwnPropertyDescriptor(result, 'b')?.value).toBe(2)
		})

		it('skips properties already memoified or signalified', () => {
			const obj = {
				get foo() {
					return 1
				},
				set foo(_v) {},
			}
			signalify(obj, 'foo')
			const before = Object.getOwnPropertyDescriptor(obj, 'foo')?.get
			memoify(obj, 'foo')
			const after = Object.getOwnPropertyDescriptor(obj, 'foo')?.get
			expect(before).toBe(after)
		})

		describe('plain object memoification', () => {
			it('memoifies a readonly method (arity 0)', () => {
				let computeCount = 0
				const obj = {
					a: 1,
					b: 2,
					sum() {
						computeCount++
						return this.a + this.b
					},
				}
				signalify(obj, 'a', 'b')
				memoify(obj, 'sum')
				let lastSum = 0
				let effectCount = 0
				createEffect(() => {
					lastSum = obj.sum()
					effectCount++
				})
				expect(lastSum).toBe(3)
				expect(effectCount).toBe(1)
				expect(computeCount).toBe(1)
				obj.a = 5
				expect(lastSum).toBe(7)
				expect(effectCount).toBe(2)
				expect(computeCount).toBe(2)
				// Should not trigger effect if computed value doesn't change
				batch(() => {
					obj.a = 3
					obj.b = 4
				})
				expect(lastSum).toBe(7)
				expect(effectCount).toBe(2)
				expect(computeCount).toBe(3) // recomputed but effect not triggered
				// @ts-expect-error Readonly memo cannot be set
				expect(() => obj.sum(20)).toThrow()
			})

			it('memoifies a writable method (arity > 0)', () => {
				let computeCount = 0
				const obj = {
					a: 1,
					b: 2,
					sum(_val?: number) {
						computeCount++
						return this.a + this.b
					},
				}
				signalify(obj, 'a', 'b')
				memoify(obj, 'sum')
				let lastSum = 0
				let effectCount = 0
				createEffect(() => {
					lastSum = obj.sum()
					effectCount++
				})
				expect(lastSum).toBe(3)
				expect(effectCount).toBe(1)
				expect(computeCount).toBe(1)
				obj.a = 5
				expect(lastSum).toBe(7)
				expect(effectCount).toBe(2)
				expect(computeCount).toBe(2)
				// Writable memo can be set directly
				obj.sum(20)
				expect(lastSum).toBe(20)
				expect(effectCount).toBe(3)
				expect(computeCount).toBe(2)
				// Changing dependencies resumes memo computation
				obj.a = 10
				expect(lastSum).toBe(12)
				expect(effectCount).toBe(4)
				expect(computeCount).toBe(3)
			})

			it('memoifies a getter (readonly)', () => {
				let computeCount = 0
				const obj = {
					a: 1,
					b: 2,
					get sum() {
						computeCount++
						return this.a + this.b
					},
				}
				signalify(obj, 'a', 'b')
				memoify(obj, 'sum')
				let lastSum = 0
				let effectCount = 0
				createEffect(() => {
					lastSum = obj.sum
					effectCount++
				})
				expect(lastSum).toBe(3)
				expect(effectCount).toBe(1)
				expect(computeCount).toBe(1)
				obj.a = 5
				expect(lastSum).toBe(7)
				expect(effectCount).toBe(2)
				expect(computeCount).toBe(2)
				// @ts-expect-error Readonly memo cannot be set
				expect(() => (obj.sum = 20)).toThrow()
			})

			it('memoifies a getter/setter (writable)', () => {
				let computeCount = 0
				const obj = {
					a: 1,
					b: 2,
					get sum() {
						computeCount++
						return this.a + this.b
					},
					set sum(_val) {},
				}
				signalify(obj, 'a', 'b')
				memoify(obj, 'sum')
				let lastSum = 0
				let effectCount = 0
				createEffect(() => {
					lastSum = obj.sum
					effectCount++
				})
				expect(lastSum).toBe(3)
				expect(effectCount).toBe(1)
				expect(computeCount).toBe(1)
				obj.a = 5
				expect(lastSum).toBe(7)
				expect(effectCount).toBe(2)
				expect(computeCount).toBe(2)
				// Writable memo can be set directly
				obj.sum = 20
				expect(lastSum).toBe(20)
				expect(effectCount).toBe(3)
				expect(computeCount).toBe(2)
				// Changing dependencies resumes memo computation
				obj.a = 10
				expect(lastSum).toBe(12)
				expect(effectCount).toBe(4)
				expect(computeCount).toBe(3)
			})
		})

		describe('class memoification', () => {
			it('memoifies class methods (readonly/writable)', () => {
				class Example {
					a = 1
					b = 2
					sum() {
						return this.a + this.b
					}
					sumWritable(_val?: number) {
						return this.a + this.b
					}
					constructor() {
						signalify(this, 'a', 'b')
						memoify(this, 'sum', 'sumWritable')
					}
				}
				const ex = new Example()
				let lastSum = 0
				let lastSumWritable = 0
				let count = 0
				createEffect(() => {
					lastSum = ex.sum()
					count++
				})
				createEffect(() => {
					lastSumWritable = ex.sumWritable()
					count++
				})
				expect(lastSum).toBe(3)
				expect(lastSumWritable).toBe(3)
				expect(count).toBe(2)
				ex.a = 5
				expect(lastSum).toBe(7)
				expect(lastSumWritable).toBe(7)
				expect(count).toBe(4)
				// Writable memo can be set directly
				ex.sumWritable(20)
				expect(lastSumWritable).toBe(20)
				expect(count).toBe(5)
				// Changing dependencies resumes memo computation
				ex.a = 10
				expect(lastSum).toBe(12)
				expect(lastSumWritable).toBe(12)
				expect(count).toBe(7)
			})

			it('memoifies getter/setter properties', () => {
				class Example {
					a = 1
					b = 2
					get sum() {
						return this.a + this.b
					}
					set sum(_val) {}
					constructor() {
						signalify(this, 'a', 'b')
						memoify(this, 'sum')
					}
				}
				const ex = new Example()
				let lastSum = 0
				let count = 0
				createEffect(() => {
					lastSum = ex.sum
					count++
				})
				expect(lastSum).toBe(3)
				expect(count).toBe(1)
				ex.a = 5
				expect(lastSum).toBe(7)
				expect(count).toBe(2)
				// Writable memo can be set directly
				ex.sum = 20
				expect(lastSum).toBe(20)
				expect(count).toBe(3)
				// Changing dependencies resumes memo computation
				ex.a = 10
				expect(lastSum).toBe(12)
				expect(count).toBe(4)
			})
		})

		it('handles memo depending on other memos', () => {
			const obj = {
				a: 2,
				get squared() {
					return this.a * this.a
				},
				get cubed() {
					return this.squared * this.a
				},
			}
			signalify(obj, 'a')
			memoify(obj, 'squared', 'cubed')
			let squared = 0
			let cubed = 0
			let count = 0
			createEffect(() => {
				squared = obj.squared
				cubed = obj.cubed
				count++
			})
			expect(squared).toBe(4)
			expect(cubed).toBe(8)
			expect(count).toBe(1)
			obj.a = 3
			expect(squared).toBe(9)
			expect(cubed).toBe(27)
			expect(count).toBe(2)
		})

		it('works with multiple memo properties', () => {
			const obj = {
				value: 10,
				double() {
					return this.value * 2
				},
				triple() {
					return this.value * 3
				},
				quadruple() {
					return this.value * 4
				},
			}
			signalify(obj, 'value')
			memoify(obj, 'double', 'triple', 'quadruple')
			let double = 0
			let triple = 0
			let quadruple = 0
			let doubleCount = 0
			let tripleCount = 0
			let quadCount = 0
			createEffect(() => {
				double = obj.double()
				doubleCount++
			})
			createEffect(() => {
				triple = obj.triple()
				tripleCount++
			})
			createEffect(() => {
				quadruple = obj.quadruple()
				quadCount++
			})
			expect(double).toBe(20)
			expect(triple).toBe(30)
			expect(quadruple).toBe(40)
			expect(doubleCount).toBe(1)
			expect(tripleCount).toBe(1)
			expect(quadCount).toBe(1)
			obj.value = 5
			expect(double).toBe(10)
			expect(triple).toBe(15)
			expect(quadruple).toBe(20)
			expect(doubleCount).toBe(2)
			expect(tripleCount).toBe(2)
			expect(quadCount).toBe(2)
		})

		it('type errors for non-existent properties', () => {
			const obj = {a: 1}
			// @ts-expect-error "foo" is not a property on obj
			memoify(obj, 'foo')
		})

		describe('lazy, Effectful-owned lifecycle', () => {
			it('is lazy: the memo body does not run until first read (method, getter, getter+setter)', () => {
				let m = 0
				let g = 0
				let gs = 0
				const obj = {
					a: 1,
					sum() {
						m++
						return this.a
					},
					get gsum() {
						g++
						return this.a
					},
					get wsum() {
						gs++
						return this.a
					},
					set wsum(_v) {},
				}
				signalify(obj, 'a')
				memoify(obj, 'sum', 'gsum', 'wsum')
				expect([m, g, gs]).toEqual([0, 0, 0])
				obj.sum()
				obj.gsum
				obj.wsum
				expect([m, g, gs]).toEqual([1, 1, 1])
			})

			it('is owned by an Effects instance shared with @effect / createEffect on the same object', () => {
				const plain = {
					a: 1,
					sum() {
						return this.a
					},
				}
				signalify(plain, 'a')
				memoify(plain, 'sum')
				const plainEffects = effects__.get(plain)
				expect(plainEffects instanceof Effects).toBe(true)

				let effectRuns = 0
				class Foo extends Effects {
					// @effect members are finalized (and run) as part of the base
					// class's field initialization, i.e. during super(), BEFORE this
					// constructor body runs signalify()/memoify(). Defer so the
					// effect first runs after the memo exists.
					static autoStartEffects = false

					a = 1
					sum() {
						return this.a
					}
					constructor() {
						super()
						signalify(this, 'a')
						memoify(this, 'sum')
						this.startEffects()
					}
					@effect log() {
						effectRuns++
						this.sum()
					}
				}
				const f = new Foo()
				// For an Effectful object, the object itself is the Effects instance.
				expect(effects__.get(f as any)).toBe(f)
				expect(effectRuns).toBe(1)
				f.a = 2
				expect(effectRuns).toBe(2)
				// One root for memoify'd memos and @effect members alike.
				f.stopEffects()
				f.a = 3
				expect(effectRuns).toBe(2)
			})

			it('is disposable with stopEffects(obj) and revivable with startEffects(obj)', () => {
				let memoRuns = 0
				let last = 0
				const obj = {
					a: 1,
					sum() {
						memoRuns++
						return this.a * 2
					},
					get wsum() {
						return this.a * 10
					},
					set wsum(_v) {},
				}
				signalify(obj, 'a')
				memoify(obj, 'sum', 'wsum')

				let effectRuns = 0
				createEffect(() => {
					effectRuns++
					last = obj.sum()
				})
				expect(memoRuns).toBe(1)
				expect(effectRuns).toBe(1)
				expect(last).toBe(2)

				stopEffects(obj)
				obj.a = 2
				// The memo is disposed and the dependent's only dependency was the
				// memo, so it is not notified while stopped...
				expect(last).toBe(2)
				expect(memoRuns).toBe(1)
				// ...but a direct read still computes a fresh value.
				expect(obj.sum()).toBe(4)
				expect(memoRuns).toBe(2)
				expect(() => (obj.wsum = 5)).toThrow('Cannot write to a memo while effects are stopped.')

				const before = effectRuns
				startEffects(obj)
				expect(effectRuns).toBe(before + 1) // restart bump, exactly once
				expect(last).toBe(4)
				obj.a = 3
				expect(last).toBe(6)
			})

			it('does not leak: a disposed memo is removed from its external dependency', () => {
				const [store, setStore] = createSignal(1)
				let memoRuns = 0
				const obj = {
					sum() {
						memoRuns++
						return store() * 2
					},
				}
				memoify(obj, 'sum')

				createRoot(() => {
					createEffect(() => obj.sum())
				})
				expect(memoRuns).toBe(1)
				setStore(2)
				expect(memoRuns).toBe(2)

				stopEffects(obj)
				setStore(3)
				expect(memoRuns).toBe(2) // no longer observing `store`
			})

			it('is owned by obj, not by the external effect that first reads it', () => {
				const [trigger, setTrigger] = createSignal(0)
				let memoRuns = 0
				let effectRuns = 0
				const obj = {
					a: 1,
					sum() {
						memoRuns++
						return this.a
					},
				}
				signalify(obj, 'a')
				memoify(obj, 'sum')

				createRoot(() => {
					createEffect(() => {
						trigger()
						effectRuns++
						obj.sum()
					})
				})
				expect(memoRuns).toBe(1)
				setTrigger(1)
				expect(effectRuns).toBe(2)
				expect(memoRuns).toBe(1)
				obj.a = 2
				expect(memoRuns).toBe(2)
				expect(effectRuns).toBe(3)
			})
		})

		it('memo with no dependencies', () => {
			let computeCount = 0
			const obj = {
				staticValue() {
					computeCount++
					return 42
				},
			}
			memoify(obj, 'staticValue')
			let value = 0
			let count = 0
			createEffect(() => {
				value = obj.staticValue()
				count++
			})
			expect(value).toBe(42)
			expect(count).toBe(1)
			expect(computeCount).toBe(1)
			// Should not recompute
			expect(obj.staticValue()).toBe(42)
			expect(computeCount).toBe(1)
		})
	})
})
