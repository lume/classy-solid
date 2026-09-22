import {createEffect, createRoot, createSignal, type Accessor, type Setter} from 'solid-js'
import {Effectful, Effects, isAnyEffectful} from './Effectful.js'
import {signal} from '../decorators/signal.js'
import {MyElement, MyElement2, MyElement3, testElementEffects} from '../index.test.js'
import {effect} from '../decorators/effect.js'

describe('classy-solid', () => {
	describe('Effectful mixin / Effects', () => {
		let last: number | null = null
		let runs = 0

		it('createEffect runs immediately, stopEffects stops further runs, startEffects runs effects again', () => {
			last = null
			runs = 0

			const [s, setS] = createSignal(1)
			const e = new Effects()

			e.createEffect(() => {
				runs++
				last = s()
			})

			testEffects(e, s, setS)
		})

		it('effects stopped initially with .stopEffects()', () => {
			last = null
			runs = 0

			const [s, setS] = createSignal(1)
			const e = new Effects()
			e.stopEffects() // stop immediately after creation

			// does not auto start
			e.addEffectFn(() => {
				runs++
				last = s()
			})

			expect(last).toBe(null)
			expect(runs).toBe(0)

			e.startEffects() // now start effects

			testEffects(e, s, setS)
		})

		it('effects stopped initially with static autoStartEffects = false', () => {
			last = null
			runs = 0

			class TestEffects extends Effects {
				static autoStartEffects = false

				@effect testEffect() {
					runs++
					last = s()
				}
			}

			const [s, setS] = createSignal(1)
			const e = new TestEffects() // effects stopped initially

			expect(last).toBe(null)
			expect(runs).toBe(0)

			e.startEffects() // now start effects

			testEffects(e, s, setS)
		})

		function testEffects(e: Effects, s: Accessor<number>, setS: Setter<number>) {
			expect(last).toBe(1)
			expect(runs).toBe(1)

			setS(2)
			expect(last).toBe(2)
			expect(runs).toBe(2)

			// later, stop effects when done (f.e. when custom element disconnected from DOM)...

			e.stopEffects()
			setS(3)
			expect(last).toBe(2)
			expect(runs).toBe(2)

			// later, start effects again (f.e. when custom element reconnected to DOM)...

			e.startEffects()
			expect(last).toBe(3)
			expect(runs).toBe(3)

			setS(4)
			expect(last).toBe(4)
			expect(runs).toBe(4)

			// Clear all effects.
			e.clearEffects()
			setS(5)
			expect(last).toBe(4)
			expect(runs).toBe(4)

			e.startEffects() // no effects to start
			expect(last).toBe(4)
			expect(runs).toBe(4)
			setS(6)
			expect(last).toBe(4)
			expect(runs).toBe(4)

			// Add a new effect after clearing previous ones

			// auto starts
			e.createEffect(() => {
				runs++
				last = s()
			})
			expect(last).toBe(6)
			expect(runs).toBe(5)

			setS(7)
			expect(last).toBe(7)
			expect(runs).toBe(6)
		}

		it('startEffects does not duplicate effects', () => {
			const [s, setS] = createSignal(1)
			const e = new Effects()

			let runs = 0
			e.createEffect(() => {
				runs++
				s()
			})

			expect(runs).toBe(1)

			e.startEffects() // should not duplicate effects

			setS(2)
			expect(runs).toBe(2)
		})

		it('clearEffects prevents effects from restarting', () => {
			const [s, setS] = createSignal(1)
			const e = new Effects()

			let runs = 0
			e.createEffect(() => {
				runs++
				s()
			})

			expect(runs).toBe(1)

			e.clearEffects()

			setS(2)
			expect(runs).toBe(1)

			e.startEffects() // should not restart any effects

			setS(3)
			expect(runs).toBe(1)
		})

		it('can be extended from', () => {
			class MyEffects extends Effects {
				double = 0

				constructor() {
					super()
					this.createEffect(() => {
						this.double = this.a * 2
					})
				}

				@signal a = 1
			}

			const me = new MyEffects()
			expect(me.double).toBe(2)

			me.a = 5
			expect(me.double).toBe(10)

			me.stopEffects()
			me.a = 10
			expect(me.double).toBe(10)

			me.startEffects()
			expect(me.double).toBe(20)
		})

		it('works with multiple Effectful-derived classes', () => {
			class Base extends Effectful(Object) {
				@signal baseSignal = 1
				baseValue = 0

				constructor() {
					super()
					this.createEffect(() => {
						this.baseValue = this.baseSignal * 10
					})
				}
			}

			class Derived extends Base {
				@signal derivedSignal = 2
				derivedValue = 0

				constructor() {
					super()
					this.createEffect(() => {
						this.derivedValue = this.derivedSignal * 100
					})
				}
			}

			const d = new Derived()
			expect(d.baseValue).toBe(10)
			expect(d.derivedValue).toBe(200)

			d.baseSignal = 3
			expect(d.baseValue).toBe(30)

			d.derivedSignal = 4
			expect(d.derivedValue).toBe(400)

			d.stopEffects()
			d.baseSignal = 5
			d.derivedSignal = 6
			expect(d.baseValue).toBe(30)
			expect(d.derivedValue).toBe(400)

			d.startEffects()
			expect(d.baseValue).toBe(50)
			expect(d.derivedValue).toBe(600)
		})

		it('supports instanceof checks', () => {
			class MyEffectful extends Effectful(Object) {}

			const me = new MyEffectful()
			expect(isAnyEffectful(me)).toBe(true)
			expect(me instanceof Effectful).toBe(true)
			expect(me instanceof Effects).toBe(false)
			expect(me instanceof MyEffectful).toBe(true)

			const e = new Effects()
			expect(isAnyEffectful(e)).toBe(true)
			expect(e instanceof Effects).toBe(true)
			expect(e instanceof Effectful).toBe(true)
			expect(e instanceof MyEffectful).toBe(false)
		})

		it('allows nested createEffect calls', () => {
			const [a, setA] = createSignal(0)
			const [b, setB] = createSignal(0)
			const e = new Effects()

			let outerRuns = 0
			let innerRuns = 0

			e.createEffect(function outer() {
				outerRuns++
				a()

				e.createEffect(function inner() {
					innerRuns++
					b()
				})
			})

			expect(outerRuns).toBe(1)
			expect(innerRuns).toBe(1)

			e.startEffects() // should not duplicate effects (already started)

			expect(outerRuns).toBe(1)
			expect(innerRuns).toBe(1)

			setA(1)
			expect(outerRuns).toBe(2)
			expect(innerRuns).toBe(2) // inner effect runs because outer effect re-ran

			setB(1)
			expect(outerRuns).toBe(2)
			expect(innerRuns).toBe(3) // inner effect runs independently

			e.stopEffects()

			expect(outerRuns).toBe(2)
			expect(innerRuns).toBe(3)

			e.startEffects()

			expect(outerRuns).toBe(3)
			expect(innerRuns).toBe(4) // inner effect runs because outer effect re-ran

			setB(2)
			expect(outerRuns).toBe(3)
			expect(innerRuns).toBe(5) // inner effect runs independently
		})

		describe('createMemo / createWritableMemo (Effectful-owned path)', () => {
			it('is lazy, cached, and recomputes on dependency change', () => {
				const [s, setS] = createSignal(2)
				const e = new Effects()
				let runs = 0

				const double = e.createMemo(() => {
					runs++
					return s() * 2
				})

				expect(runs).toBe(0)
				expect(double()).toBe(4)
				expect(runs).toBe(1)
				expect(double()).toBe(4)
				expect(runs).toBe(1)

				setS(3)
				expect(double()).toBe(6)
				expect(runs).toBe(2)
			})

			it('stops with stopEffects and restarts with startEffects, keeping the same accessor', () => {
				const [s, setS] = createSignal(1)
				const e = new Effects()
				let memoRuns = 0
				let effectRuns = 0
				let last = 0

				const double = e.createMemo(() => {
					memoRuns++
					return s() * 2
				})

				// External dependent (not one of e's effects).
				createRoot(() => {
					createEffect(() => {
						effectRuns++
						last = double()
					})
				})

				expect(memoRuns).toBe(1)
				expect(effectRuns).toBe(1)
				expect(last).toBe(2)

				setS(2)
				expect(memoRuns).toBe(2)
				expect(effectRuns).toBe(2)
				expect(last).toBe(4)

				e.stopEffects()

				// Stopped: the memo is disposed, so a dependency change neither
				// recomputes it nor notifies the external effect (whose only
				// dependency was the memo)...
				setS(3)
				expect(memoRuns).toBe(2)
				expect(effectRuns).toBe(2)
				expect(last).toBe(4)
				// ...but a read still returns a fresh value, computed directly.
				expect(double()).toBe(6)
				expect(memoRuns).toBe(3) // direct fn() call, not a memo

				e.startEffects()

				// The restart bump re-runs dependents exactly once; they pick up
				// a fresh memo.
				expect(effectRuns).toBe(3)
				expect(memoRuns).toBe(4)
				expect(last).toBe(6)

				setS(4)
				expect(effectRuns).toBe(4)
				expect(last).toBe(8)
			})

			it('a stopped read is tracked (behaves like a plain getter)', () => {
				const [s, setS] = createSignal(1)
				const e = new Effects()
				const double = e.createMemo(() => s() * 2)
				let effectRuns = 0
				let last = 0

				e.stopEffects()

				createRoot(() => {
					createEffect(() => {
						effectRuns++
						last = double()
					})
				})

				expect(effectRuns).toBe(1)
				expect(last).toBe(2)

				// The reader tracked s() directly through the fallback compute.
				setS(5)
				expect(effectRuns).toBe(2)
				expect(last).toBe(10)
			})

			it('a stopped read passes the initial value as prev', () => {
				const e = new Effects()
				const prevs: (number | undefined)[] = []
				const m = e.createMemo(prev => {
					prevs.push(prev)
					return (prev ?? 0) + 1
				}, 41)

				e.stopEffects()
				expect(m()).toBe(42)
				expect(prevs).toEqual([41])
			})

			it('writable: override, then dependency change resumes; writing while stopped throws', () => {
				const [s, setS] = createSignal(1)
				const e = new Effects()
				const [val, setVal] = e.createWritableMemo(() => s() * 10)
				let last = 0

				createRoot(() => {
					createEffect(() => {
						last = val()
					})
				})

				expect(last).toBe(10)
				setVal(99)
				expect(last).toBe(99)
				setS(2)
				expect(last).toBe(20)

				e.stopEffects()
				expect(() => setVal(5)).toThrow('Cannot write to a memo while effects are stopped.')
			})

			it('survives re-runs of the external effect that first read it', () => {
				const [s, setS] = createSignal(1)
				const [trigger, setTrigger] = createSignal(0)
				const e = new Effects()
				let memoRuns = 0
				let effectRuns = 0

				const double = e.createMemo(() => {
					memoRuns++
					return s() * 2
				})

				createRoot(() => {
					createEffect(() => {
						trigger()
						effectRuns++
						double() // first read inside this effect
					})
				})

				expect(memoRuns).toBe(1)
				setTrigger(1) // effect re-runs; must not dispose the memo
				expect(effectRuns).toBe(2)
				expect(memoRuns).toBe(1)
				setS(2) // memo still alive and still notifies
				expect(memoRuns).toBe(2)
				expect(effectRuns).toBe(3)
			})

			it('memo created in the constructor is owned by the instance', () => {
				const [s, setS] = createSignal(1)
				let memoRuns = 0

				class Foo extends Effects {
					double = this.createMemo(() => {
						memoRuns++
						return s() * 2
					})
				}

				const f = new Foo()
				let last = 0
				createRoot(() => {
					createEffect(() => {
						last = f.double()
					})
				})

				expect(last).toBe(2)
				setS(2)
				expect(last).toBe(4)
				expect(memoRuns).toBe(2)

				f.stopEffects()
				setS(3)
				expect(memoRuns).toBe(2) // disposed
			})

			it('README example: memo in a field initializer, effect in the constructor', () => {
				const logs: string[] = []

				class Box extends Effects {
					@signal width = 1
					@signal height = 2

					// Owned by the instance root (created in the constructor scope).
					area = this.createMemo(() => this.width * this.height)

					constructor() {
						super()
						this.createEffect(() => logs.push('area: ' + this.area()))
					}
				}

				const box = new Box()
				expect(logs).toEqual(['area: 2'])

				box.width = 3
				expect(logs).toEqual(['area: 2', 'area: 6'])

				box.stopEffects()
				box.width = 4
				expect(logs).toEqual(['area: 2', 'area: 6']) // nothing logged
				expect(box.area()).toBe(8) // computed directly

				box.startEffects()
				expect(logs).toEqual(['area: 2', 'area: 6', 'area: 8'])

				box.stopEffects()
			})

			it('parent-owner disposal stops the instance; startEffects revives it', () => {
				const [s, setS] = createSignal(1)
				let memoRuns = 0
				let effectRuns = 0
				let e!: Effects
				let dispose!: () => void
				let double!: () => number

				createRoot(d => {
					dispose = d
					e = new Effects()
					double = e.createMemo(() => {
						memoRuns++
						return s() * 2
					})
					e.createEffect(() => {
						effectRuns++
						double()
					})
				})

				expect(memoRuns).toBe(1)
				expect(effectRuns).toBe(1)

				dispose() // parent cleanup → e.stopEffects()

				setS(2)
				expect(memoRuns).toBe(1) // memo disposed
				expect(effectRuns).toBe(1) // effect disposed

				// The instance knows it is stopped, so startEffects is not a no-op.
				e.startEffects()
				expect(effectRuns).toBe(2)
				expect(memoRuns).toBe(2)

				setS(3)
				expect(effectRuns).toBe(3)
				expect(memoRuns).toBe(3)

				e.stopEffects()
			})
		})

		describe('createMemo / createWritableMemo (nested in own effect)', () => {
			it('is a lazy memo owned by the enclosing effect, disposed and recreated with it', () => {
				const [a, setA] = createSignal(2)
				const [b, setB] = createSignal(3)
				const e = new Effects()
				let outerRuns = 0
				let innerRuns = 0
				let memoRuns = 0
				let last = 0

				e.createEffect(() => {
					outerRuns++
					a()
					const memoRunsAtOuterStart = memoRuns
					const prod = e.createMemo(() => {
						memoRuns++
						return a() * b()
					})
					expect(memoRuns).toBe(memoRunsAtOuterStart) // lazy: not run yet in this outer run

					createEffect(() => {
						innerRuns++
						last = prod() // deeper child reads it → memo created here, owned by outer
					})
				})

				expect(outerRuns).toBe(1)
				expect(innerRuns).toBe(1)
				expect(memoRuns).toBe(1)
				expect(last).toBe(6)

				setB(4) // memo recomputes, inner re-runs, outer does not
				expect(memoRuns).toBe(2)
				expect(innerRuns).toBe(2)
				expect(outerRuns).toBe(1)
				expect(last).toBe(8)

				setA(3) // outer re-runs → disposes old memo, creates a new lazy one
				expect(outerRuns).toBe(2)
				expect(innerRuns).toBe(3)
				expect(memoRuns).toBe(3)
				expect(last).toBe(12)

				e.stopEffects()
				setB(5)
				expect(memoRuns).toBe(3) // gone with the effect tree
			})

			it('throws when called from an ancestor reactive context other than the direct parent', () => {
				let e!: Effects
				let dispose!: () => void

				createRoot(d => {
					dispose = d
					// Nested root: e's #parentOwner is the inner root; the outer
					// root is its grandparent. (Roots run synchronously, unlike
					// effects, so `e` is assigned before we return.) The inner
					// root must be OWNED — Solid treats a zero-arity createRoot
					// callback as unowned, with no `.owner` link to the outer root.
					createRoot(_innerDispose => {
						e = new Effects()
					})

					// The outer root's owner is an ancestor of e.#owner but not its
					// direct parent → parent-context misuse, same rule as createEffect.
					expect(() => e.createMemo(() => 1)).toThrow(
						'Do not call .createMemo or .createWritableMemo methods in parent reactive contexts.',
					)
				})

				dispose()
			})
		})

		describe('invalid usages', () => {
			it('prevents multiple Effectful mixin applications', () => {
				expect(() => {
					class Base extends Effectful(Object) {}
					class Derived extends Effectful(Base) {}
					Derived
				}).toThrow('Base class already extends Effectful, no need to apply the mixin again.')
			})
		})

		describe('usage with custom elements', () => {
			it('createEffect in connectedCallback, clearEffects in disconnectedCallback', () => {
				const el = document.createElement('my-element') as MyElement
				expect(el.result).toBe(0)
				expect(el.runs).toBe(0)

				testElementEffects(el)
			})

			it('createEffect in constructor, startEffects in connectedCallback, stopEffects in disconnectedCallback', () => {
				const el = document.createElement('my-element2') as MyElement2
				expect(el.result).toBe(1 + 2)
				expect(el.runs).toBe(1) // already ran in constructor

				testElementEffects(el)
			})

			it('@effect methods, startEffects in connectedCallback, stopEffects in disconnectedCallback', () => {
				const el = document.createElement('my-element3') as MyElement3
				expect(el.result).toBe(1 + 2)
				expect(el.runs).toBe(1) // already ran in constructor

				testElementEffects(el)
			})
		})
	})
})
