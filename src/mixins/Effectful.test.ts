import {createSignal} from 'solid-js'
import {Effectful, Effects} from './Effectful.js'
import {signal} from '../decorators/signal.js'
import {MyElement, MyElement2, MyElement3, testElementEffects} from '../index.test.js'

describe('classy-solid', () => {
	describe('Effectful mixin / Effects', () => {
		it('createEffect runs immediately, stopEffects stops further runs, startEffects runs effects again', () => {
			const [s, setS] = createSignal(1)
			const e = new Effects()

			let last = null
			let runs = 0
			e.createEffect(() => {
				runs++
				last = s()
			})

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

			e.createEffect(() => {
				runs++
				last = s()
			})
			expect(last).toBe(6)
			expect(runs).toBe(5)

			setS(7)
			expect(last).toBe(7)
			expect(runs).toBe(6)
		})

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
			expect(me instanceof Effectful).toBe(true)
			expect(me instanceof MyEffectful).toBe(true)

			const e = new Effects()
			expect(e instanceof Effects).toBe(true)
			expect(e instanceof Effectful).toBe(true)
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

		describe('invalid usages', () => {
			it('prevents multiple Effectful mixin applications', () => {
				expect(() => {
					class Base extends Effectful(Object) {}
					class Derived extends Effectful(Base) {}
					Derived
				}).toThrow('Class already extends Effectful, no need to apply the mixin again.')
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
