import {batch, createEffect} from 'solid-js'
import {signalify} from './signalify.js'
import {memoify} from './memoify.js'

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
				}
				const ex = new Example()
				signalify(ex, 'a', 'b')
				memoify(ex, 'sum', 'sumWritable')
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
				}
				const ex = new Example()
				signalify(ex, 'a', 'b')
				memoify(ex, 'sum')
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
