import {createEffect, batch} from 'solid-js'
import {reactive} from './reactive.js'
import {signal} from './signal.js'
import {memo} from './memo.js'

describe('classy-solid', () => {
	describe('@reactive, @signal, @memo', () => {
		it('creates a readonly memo via field', () => {
			// @reactive
			class Example {
				@signal a = 1
				@signal b = 2

				@memo sum = () => this.a + this.b
			}

			const ex = new Example()
			let count = 0
			let lastSum = 0

			createEffect(() => {
				lastSum = ex.sum()
				count++
			})

			expect(ex.sum()).toBe(3)
			expect(count).toBe(1)

			ex.a = 5
			expect(ex.sum()).toBe(7)
			expect(lastSum).toBe(7)
			expect(count).toBe(2)

			// This should not trigger the effect since the computed value doesn't change (still 7)
			batch(() => {
				ex.a = 3
				ex.b = 4
			})

			expect(ex.sum()).toBe(7)
			expect(lastSum).toBe(7)
			expect(count).toBe(2) // count should still be 2, not 3

			// @ts-expect-error Readonly memo cannot be set - should throw
			expect(() => ex.sum(20)).toThrow()
		})

		it('creates a writable memo via field', () => {
			class Example {
				@signal a = 1
				@signal b = 2

				@memo sum = (_val?: number) => this.a + this.b
			}

			const ex = new Example()
			let count = 0
			let lastSum = 0

			createEffect(() => {
				lastSum = ex.sum()
				count++
			})

			expect(ex.sum()).toBe(3)
			expect(count).toBe(1)

			ex.a = 5
			expect(ex.sum()).toBe(7)
			expect(lastSum).toBe(7)
			expect(count).toBe(2)

			// This should not trigger the effect since the computed value doesn't change (still 7)
			batch(() => {
				ex.a = 3
				ex.b = 4
			})

			expect(ex.sum()).toBe(7)
			expect(lastSum).toBe(7)
			expect(count).toBe(2) // count should still be 2, not 3

			// Writable memo can be set directly
			ex.sum(20)
			expect(ex.sum()).toBe(20)
			expect(lastSum).toBe(20)
			expect(count).toBe(3)
		})

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
			@reactive
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
			@reactive
			class Example {
				@signal a = 1
				@signal b = 2

				@memo accessor sum3 = () => this.a + this.b
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

			// @ts-expect-error Readonly memo cannot be set - should throw
			expect(() => ex.sum3(20)).toThrow()
		})

		it('creates a writable memo via accessor function value', () => {
			@reactive
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
			@reactive
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
			@reactive
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
			@reactive
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
			@reactive
			class MultiMemo {
				@signal value = 10

				@memo double = () => this.value * 2
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
			@reactive
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

		it('correctly handles writable field memo overriding explicit value', () => {
			@reactive
			class WritableOverride {
				@signal a = 5
				@signal b = 10

				@memo sum = (_val?: number) => this.a + this.b
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

		it('correctly handles writable getter+setter memo overriding explicit value', () => {
			@reactive
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
			@reactive
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
			@reactive
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

		it('works correctly without @reactive decorator when using field-based approach', () => {
			class Example {
				@signal a = 1
				@signal b = 2
				@memo sum = () => this.a + this.b
				// @ts-ignore
				@signal #finalize
			}

			const ex = new Example()
			let count = 0

			createEffect(() => {
				ex.sum()
				count++
			})

			expect(ex.sum()).toBe(3)
			expect(count).toBe(1)

			ex.a = 5
			expect(ex.sum()).toBe(7)
			expect(count).toBe(2)
		})

		it('handles memo with no dependencies', () => {
			@reactive
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
	})
})
