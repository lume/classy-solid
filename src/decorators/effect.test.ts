import {createSignal, batch, createRoot, createEffect} from 'solid-js'
import {signal} from './signal.js'
import {memo} from './memo.js'
import {effect, startEffects, stopEffects} from './effect.js'
import {Effects} from '../mixins/Effectful.js'
import {testElementEffects, type MyElement4} from '../index.test.js'

describe('classy-solid', () => {
	describe('@effect decorator', () => {
		it('runs a basic public method effect, using stopEffects', () => {
			const [a, setA] = createSignal(1)

			class Funkalicious {
				last: number | null = null
				runs = 0

				@signal b = 2

				@effect logSum() {
					this.runs++
					this.last = a() + this.b
				}
			}

			const fun = new Funkalicious()
			basicTest(fun, setA)
		})

		it('runs a basic public method effect, using stopEffects, with autoStart false', () => {
			const [a, setA] = createSignal(1)

			class Funkalicious {
				last: number | null = null
				runs = 0

				@signal b = 2

				static autoStartEffects = false

				@effect logSum() {
					this.runs++
					this.last = a() + this.b
				}
			}

			const fun = new Funkalicious()

			// Ensure effects didn't start yet.
			expect(fun.last === null).toBe(true)
			expect(fun.runs).toBe(0)

			startEffects(fun) // manually start first

			basicTest(fun, setA)
		})

		it('works with both static autoStartEffects = false and Effects class without calling start/stopEffects methods', () => {
			const [a, setA] = createSignal(1)

			class Funkalicious extends Effects {
				last: number | null = null
				runs = 0

				@signal b = 2

				static autoStartEffects = false

				@effect logSum() {
					this.runs++
					this.last = a() + this.b
				}
			}

			const fun = new Funkalicious()

			// Ensure effects didn't start yet.
			expect(fun.last === null).toBe(true)
			expect(fun.runs).toBe(0)

			startEffects(fun) // manually start first

			basicTest(fun, setA, true)
		})

		it('runs a basic private method effect, using stopEffects', () => {
			const [a, setA] = createSignal(1)

			class Funkalicious {
				last: number | null = null
				runs = 0

				@signal b = 2

				// @ts-expect-error unused private method
				@effect #logSum() {
					this.runs++
					this.last = a() + this.b
				}
			}

			const fun = new Funkalicious()
			basicTest(fun, setA)
		})

		it('runs a basic private auto accessor effect, using stopEffects', () => {
			const [a, setA] = createSignal(1)

			class Funkalicious {
				last: number | null = null
				runs = 0

				@signal b = 2

				// @ts-expect-error unused private member
				@effect accessor #logSum = () => {
					this.runs++
					this.last = a() + this.b
				}
			}

			const fun = new Funkalicious()
			basicTest(fun, setA)
		})

		it('runs a basic public method effect, using Effects', () => {
			const [a, setA] = createSignal(1)

			class Funkalicious extends Effects {
				last: number | null = null
				runs = 0

				@signal b = 2

				@effect logSum() {
					this.runs++
					this.last = a() + this.b
				}
			}

			const fun = new Funkalicious()
			basicTest(fun, setA)
		})

		it('runs a basic private method effect, using Effects', () => {
			const [a, setA] = createSignal(1)

			class Funkalicious extends Effects {
				last: number | null = null
				runs = 0

				@signal b = 2

				// @ts-expect-error unused private method
				@effect #logSum() {
					this.runs++
					this.last = a() + this.b
				}
			}

			const fun = new Funkalicious()
			basicTest(fun, setA)
		})

		it('runs a basic private auto accessor effect, using Effects', () => {
			const [a, setA] = createSignal(1)

			class Funkalicious extends Effects {
				last: number | null = null
				runs = 0

				@signal b = 2

				// @ts-expect-error unused private member
				@effect accessor #logSum = () => {
					this.runs++
					this.last = a() + this.b
				}
			}

			const fun = new Funkalicious()
			basicTest(fun, setA)
		})

		function basicTest(
			fun: {b: number; last: number | null; runs: number},
			setA: (v: number) => void,
			useFunctions = false,
		) {
			expect(fun.last).toBe(1 + 2)
			expect(fun.runs).toBe(1)

			setA(5)
			expect(fun.last).toBe(5 + 2)
			expect(fun.runs).toBe(2)

			fun.b = 10
			expect(fun.last).toBe(5 + 10)
			expect(fun.runs).toBe(3)
			fun instanceof Effects && !useFunctions ? fun.stopEffects() : stopEffects(fun)
			setA(1)
			fun.b = 1
			expect(fun.last).toBe(5 + 10)
			expect(fun.runs).toBe(3)

			fun instanceof Effects && !useFunctions ? fun.startEffects() : startEffects(fun)
			expect(fun.last).toBe(1 + 1)
			expect(fun.runs).toBe(4)

			// Ensure no duplicate effects
			fun instanceof Effects && !useFunctions ? fun.startEffects() : startEffects(fun)
			expect(fun.last).toBe(1 + 1)
			expect(fun.runs).toBe(4)

			setA(3)
			expect(fun.last).toBe(3 + 1)
			expect(fun.runs).toBe(5)

			fun instanceof Effects && !useFunctions ? fun.stopEffects() : stopEffects(fun)
			setA(10)
			fun.b = 20
			expect(fun.last).toBe(3 + 1)
			expect(fun.runs).toBe(5)
		}

		it('runs multiple effects independently, using Effects', () => {
			const [a, setA] = createSignal(1)
			let sum1 = 0
			let sum2 = 0
			let runs = 0

			class Doubler extends Effects {
				@signal b = 3
				@effect eff1() {
					runs++
					sum1 = a() + this.b
				}
				@effect accessor eff2 = () => {
					runs++
					sum2 = (a() + this.b) * 2
				}
			}

			const o = new Doubler()
			expect(sum1).toBe(4)
			expect(sum2).toBe(8)
			expect(runs).toBe(2)

			setA(2)
			expect(sum1).toBe(5)
			expect(sum2).toBe(10)
			expect(runs).toBe(4)

			o.b = 4
			expect(sum1).toBe(6)
			expect(sum2).toBe(12)
			expect(runs).toBe(6)

			o.stopEffects()
			setA(10)
			o.b = 20
			expect(sum1).toBe(6)
			expect(sum2).toBe(12)
			expect(runs).toBe(6)
		})

		it('runs multiple effects independently, using stopEffects', () => {
			const [a, setA] = createSignal(1)
			let sum1 = 0
			let sum2 = 0
			let runs = 0

			class Doubler {
				@signal b = 3
				@effect eff1() {
					runs++
					sum1 = a() + this.b
				}
				@effect accessor eff2 = () => {
					runs++
					sum2 = (a() + this.b) * 2
				}
			}

			const o = new Doubler()
			expect(sum1).toBe(4)
			expect(sum2).toBe(8)
			expect(runs).toBe(2)

			setA(2)
			expect(sum1).toBe(5)
			expect(sum2).toBe(10)
			expect(runs).toBe(4)

			o.b = 4
			expect(sum1).toBe(6)
			expect(sum2).toBe(12)
			expect(runs).toBe(6)

			stopEffects(o)
			setA(10)
			o.b = 20
			expect(sum1).toBe(6)
			expect(sum2).toBe(12)
			expect(runs).toBe(6)
		})

		it('reruns effect when memos change inside effect, using Effects', () => {
			const [a, setA] = createSignal(1)
			const [b, setB] = createSignal(2)
			let memoVal = 0
			let effectRuns = 0

			class MemoUser extends Effects {
				@memo get sum() {
					return a() + b()
				}
				@effect report() {
					effectRuns++
					memoVal = this.sum
				}
			}

			const m = new MemoUser()
			expect(memoVal).toBe(3)
			expect(effectRuns).toBe(1)

			setA(5)
			expect(memoVal).toBe(7)
			expect(effectRuns).toBe(2)

			batch(() => {
				setA(6)
				setB(1)
			}) // sum stays 7
			expect(effectRuns).toBe(2)

			setB(5)
			expect(memoVal).toBe(11)
			expect(effectRuns).toBe(3)

			m.stopEffects()
			setA(0)
			setB(0)
			expect(memoVal).toBe(11)
			expect(effectRuns).toBe(3)
		})

		it('reruns effect when memos change inside effect, using stopEffects', () => {
			const [a, setA] = createSignal(1)
			const [b, setB] = createSignal(2)
			let memoVal = 0
			let effectRuns = 0

			class MemoUser {
				@memo get sum() {
					return a() + b()
				}
				@effect report() {
					effectRuns++
					memoVal = this.sum
				}
			}

			const m = new MemoUser()
			expect(memoVal).toBe(3)
			expect(effectRuns).toBe(1)

			setA(5)
			expect(memoVal).toBe(7)
			expect(effectRuns).toBe(2)

			batch(() => {
				setA(6)
				setB(1)
			}) // sum stays 7
			expect(effectRuns).toBe(2)

			setB(5)
			expect(memoVal).toBe(11)
			expect(effectRuns).toBe(3)

			stopEffects(m)
			setA(0)
			setB(0)
			expect(memoVal).toBe(11)
		})

		it('runs an effect on auto accessor, using Effects', () => {
			const [a, setA] = createSignal(1)

			class AccessorClass extends Effects {
				@signal b = 2

				// Stick this here to ensure that nested constructor doesn't
				// interfere with decorator behavior mid-way through initialization
				// of the wrapper parent class (tested with a subclass)
				child: AccessorClass | null = this.constructor !== AccessorClass ? new AccessorClass() : null

				result = 0
				runs = 0
				@effect accessor compute = () => {
					this.runs++
					this.result = a() + this.b
				}
			}

			class Sub extends AccessorClass {}

			const o = new Sub()
			expect(o.result).toBe(3)
			expect(o.runs).toBe(1)

			setA(5)
			expect(o.result).toBe(7)
			expect(o.runs).toBe(2)
			o.b = 10
			expect(o.result).toBe(15)
			expect(o.runs).toBe(3)

			o.stopEffects()
			setA(1)
			o.b = 1
			expect(o.result).toBe(15)
			expect(o.runs).toBe(3)
		})

		it('runs an effect on auto accessor, using stopEffects', () => {
			const [a, setA] = createSignal(1)

			class AccessorClass {
				@signal b = 2

				// Stick this here to ensure that nested constructor doesn't
				// interfere with decorator behavior mid-way through initialization
				// of the wrapper parent class (tested with a subclass)
				child: AccessorClass | null = this.constructor !== AccessorClass ? new AccessorClass() : null

				result = 0
				runs = 0
				@effect accessor compute = () => {
					this.runs++
					this.result = a() + this.b
				}
			}

			class Sub extends AccessorClass {}

			const o = new Sub()
			expect(o.result).toBe(3)
			expect(o.runs).toBe(1)

			setA(5)
			expect(o.result).toBe(7)
			expect(o.runs).toBe(2)

			o.b = 10
			expect(o.result).toBe(15)
			expect(o.runs).toBe(3)

			stopEffects(o)
			setA(1)
			o.b = 1
			expect(o.result).toBe(15)
			expect(o.runs).toBe(3)
		})

		it('managed within an existing root, without Effects, without stopEffects', () => {
			const [a, setA] = createSignal(1)
			let observed = 0
			let runs = 0

			class PlainYogurt {
				@signal b = 2
				@effect sum() {
					runs++
					observed = a() + this.b
				}
			}

			let p!: PlainYogurt
			let dispose!: () => void

			createRoot(d => {
				p = new PlainYogurt()
				dispose = d
			})

			// As p is created inside a root, it will be tied to that root's owner,
			// so this stopEffects(p) will not dispose the effects.
			stopEffects(p)

			expect(observed).toBe(3)
			expect(runs).toBe(1)

			setA(4)
			p.b = 5

			expect(observed).toBe(9)
			expect(runs).toBe(3)

			// Now dispose the root to clean up effects
			dispose()
			setA(10)
			p.b = 20
			expect(observed).toBe(9) // disposed root, no further updates
			expect(runs).toBe(3)
		})

		describe('subclass effect overriding/extending', () => {
			it('runs subclass effect auto accessor extending base effect auto accessor with super', () => {
				const [a, setA] = createSignal(1)

				let baseRuns = 0
				let subRuns = 0
				let observed = 0

				class Base extends Effects {
					@signal b = 2
					@effect accessor eff = () => {
						baseRuns++
						observed = a() + this.b
					}
				}

				class Sub extends Base {
					@effect override accessor eff = () => {
						subRuns++
						super.eff()
						observed = observed + 10
					}
				}

				const o = new Sub()
				expect(baseRuns).toBe(1)
				expect(subRuns).toBe(1)
				expect(observed).toBe(1 + 2 + 10)

				o.b = 5
				expect(baseRuns).toBe(2)
				expect(subRuns).toBe(2)
				expect(observed).toBe(1 + 5 + 10)

				setA(10)
				expect(baseRuns).toBe(3)
				expect(subRuns).toBe(3)
				expect(observed).toBe(10 + 5 + 10)

				o.stopEffects()
				o.b = 100
				expect(baseRuns).toBe(3)
				expect(subRuns).toBe(3)
				expect(observed).toBe(10 + 5 + 10)
			})

			it('runs subclass effect auto accessor overriding base effect auto accessor without super', () => {
				const [a, setA] = createSignal(1)

				let baseRuns = 0
				let subRuns = 0
				let observed = 0

				class Base extends Effects {
					@signal b = 2
					@effect accessor eff = () => {
						baseRuns++
						observed = a() + this.b
					}
				}

				class Sub extends Base {
					@effect override accessor eff = () => {
						subRuns++
						observed = (a() + this.b) * 2 // override without super
					}
				}

				const o = new Sub()
				expect(baseRuns).toBe(0)
				expect(subRuns).toBe(1)
				expect(observed).toBe((1 + 2) * 2)

				o.b = 5
				expect(baseRuns).toBe(0)
				expect(subRuns).toBe(2)
				expect(observed).toBe((1 + 5) * 2)

				setA(10)
				expect(baseRuns).toBe(0)
				expect(subRuns).toBe(3)
				expect(observed).toBe((10 + 5) * 2)

				o.stopEffects()
				o.b = 100
				expect(baseRuns).toBe(0)
				expect(subRuns).toBe(3)
				expect(observed).toBe((10 + 5) * 2)
			})

			it('runs subclass effect method extending base effect method with super', () => {
				const [a, setA] = createSignal(1)
				let superRuns = 0
				let subRuns = 0
				let observed = 0

				class Base extends Effects {
					@signal b = 2
					@effect compute() {
						superRuns++
						observed = a() + this.b
					}
				}

				class Sub extends Base {
					@signal c = 3
					@effect override compute() {
						subRuns++
						super.compute()
						observed += this.c // extend behavior
					}
				}

				const o = new Sub()
				expect(superRuns).toBe(1)
				expect(subRuns).toBe(1)
				expect(observed).toBe(1 + 2 + 3) // a + b + extension

				setA(5)
				expect(superRuns).toBe(2)
				expect(subRuns).toBe(2)
				expect(observed).toBe(5 + 2 + 3)

				o.b = 10
				expect(superRuns).toBe(3)
				expect(subRuns).toBe(3)
				expect(observed).toBe(5 + 10 + 3)

				o.c = 5
				expect(superRuns).toBe(4)
				expect(subRuns).toBe(4)
				expect(observed).toBe(5 + 10 + 5)

				o.stopEffects()
				setA(0)
				o.b = 0
				o.c = 0
				expect(superRuns).toBe(4)
				expect(subRuns).toBe(4)
				expect(observed).toBe(5 + 10 + 5)
			})

			it('supports multi-level effect method extending base effect method with super', () => {
				const [a, setA] = createSignal(1)
				let baseRuns = 0
				let midRuns = 0
				let subRuns = 0
				let observed = 0

				class Base extends Effects {
					@signal b = 2
					@effect compute() {
						baseRuns++
						observed = a() + this.b
					}
				}

				class Mid extends Base {
					@signal c = 3
					@effect override compute() {
						midRuns++
						super.compute()
						observed += this.c
					}
				}

				class Sub extends Mid {
					@signal d = 4
					@effect override compute() {
						subRuns++
						super.compute()
						observed += this.d
					}
				}

				const o = new Sub()
				expect(baseRuns).toBe(1)
				expect(midRuns).toBe(1)
				expect(subRuns).toBe(1)
				expect(observed).toBe(1 + 2 + 3 + 4)

				setA(5)
				expect(baseRuns).toBe(2)
				expect(midRuns).toBe(2)
				expect(subRuns).toBe(2)
				expect(observed).toBe(5 + 2 + 3 + 4)

				o.b = 10
				expect(baseRuns).toBe(3)
				expect(midRuns).toBe(3)
				expect(subRuns).toBe(3)
				expect(observed).toBe(5 + 10 + 3 + 4)

				o.c = 6
				expect(baseRuns).toBe(4)
				expect(midRuns).toBe(4)
				expect(subRuns).toBe(4)
				expect(observed).toBe(5 + 10 + 6 + 4)

				o.d = 7
				expect(baseRuns).toBe(5)
				expect(midRuns).toBe(5)
				expect(subRuns).toBe(5)
				expect(observed).toBe(5 + 10 + 6 + 7)

				o.stopEffects()
				setA(0)
				o.b = 0
				o.c = 0
				o.d = 0
				expect(baseRuns).toBe(5)
				expect(midRuns).toBe(5)
				expect(subRuns).toBe(5)
				expect(observed).toBe(5 + 10 + 6 + 7)
			})

			it('runs subclass effect method overriding base effect method without super', () => {
				const [a, setA] = createSignal(1)
				let superRuns = 0
				let subRuns = 0
				let observed = 0

				class Base extends Effects {
					@signal b = 2
					@effect compute() {
						superRuns++
						observed = a() + this.b
					}
				}

				class Sub extends Base {
					@effect override compute() {
						subRuns++
						observed = (a() + this.b) * 2 // override without super
					}
				}

				const o = new Sub()
				expect(superRuns).toBe(0)
				expect(subRuns).toBe(1)
				expect(observed).toBe((1 + 2) * 2)

				setA(3)
				expect(superRuns).toBe(0)
				expect(subRuns).toBe(2)
				expect(observed).toBe((3 + 2) * 2)

				o.b = 5
				expect(superRuns).toBe(0)
				expect(subRuns).toBe(3)
				expect(observed).toBe((3 + 5) * 2)

				o.stopEffects()
				setA(10)
				o.b = 1
				expect(subRuns).toBe(3)
			})
		})

		it('works with nested effects', () => {
			let outerRuns = 0
			let innerRuns = 0

			class MyEffects {
				@signal a = 0
				@signal b = 0

				@effect outer() {
					outerRuns++
					this.a

					createEffect(() => {
						innerRuns++
						this.b
					})
				}
			}

			const e = new MyEffects()

			expect(outerRuns).toBe(1)
			expect(innerRuns).toBe(1)

			startEffects(e) // should not duplicate effects (already started)

			expect(outerRuns).toBe(1)
			expect(innerRuns).toBe(1)

			e.a = 1
			expect(outerRuns).toBe(2)
			expect(innerRuns).toBe(2) // inner effect runs because outer effect re-ran

			e.b = 1
			expect(outerRuns).toBe(2)
			expect(innerRuns).toBe(3) // inner effect runs independently

			stopEffects(e)

			expect(outerRuns).toBe(2)
			expect(innerRuns).toBe(3)

			startEffects(e)

			expect(outerRuns).toBe(3)
			expect(innerRuns).toBe(4) // inner effect runs because outer effect re-ran

			e.b = 2
			expect(outerRuns).toBe(3)
			expect(innerRuns).toBe(5) // inner effect runs independently
		})

		describe('invalid usage', () => {
			it('throws on invalid field usage', () => {
				expect(() => {
					class BadField {
						// @ts-expect-error invalid decorator usage on field
						@effect nope = () => 123
					}
					new BadField()
				}).toThrow('@effect can only be used on methods or function-valued auto accessors')
			})

			it('throws on invalid getter usage', () => {
				expect(() => {
					class BadGetter {
						@signal a = 1
						// @ts-expect-error invalid decorator usage on getter
						@effect get nope() {
							return this.a
						}
					}
					new BadGetter()
				}).toThrow('@effect can only be used on methods or function-valued auto accessors')
			})

			it('throws on invalid static usage', () => {
				expect(() => {
					class BadStatic {
						@effect static nope() {}
					}
					BadStatic
				}).toThrow('@effect is not supported on static members.')
			})

			it('throws on invalid non-function value', () => {
				expect(() => {
					class NonFunction {
						@signal a = 1
						// @ts-expect-error invalid decorator usage on non-function
						@effect accessor nope: number = 123
					}
					new NonFunction()
				}).toThrow('@effect decorated member "nope" is not a function')
			})

			it('throws on duplicate members', () => {
				const run = () => {
					class SuperDuper {
						// @ts-expect-error duplicate member
						@effect dupe() {
							this
						}

						// @ts-expect-error duplicate member
						@effect dupe() {
							this
						}
					}

					new SuperDuper()
				}

				// When compiling with Babel, decorators currently throw an error when applied onto multiple members of the same name.
				expect(run).toThrow('Decorating two elements with the same name (dupe) is not supported yet')

				// When compiling with TypeScript, decorating duplicate members is allowed, and the last one wins.
				// expect(run).toThrow(
				// 	'@effect decorated member "dupe" has already been effectified. This can happen if there are duplicated class members.',
				// )
			})
		})

		describe('usage with custom elements', () => {
			it('@effect methods, startEffects in connectedCallback, stopEffects in disconnectedCallback', () => {
				const el = document.createElement('my-element4') as MyElement4
				expect(el.result).toBe(1 + 2)
				expect(el.runs).toBe(1) // already ran in constructor

				testElementEffects(el)
			})
		})
	})
})
