import {createComputed, createRoot} from 'solid-js'
import {Effectful} from './mixins/index.js'
import {effect, memo, signal, startEffects, stopEffects} from './decorators/index.js'

// TODO move type def to @lume/cli, map @types/jest's `expect` type into the
// global env.
declare global {
	function expect(...args: any[]): any
}

// Test helper shared with other test files.
export function testButterflyProps(b: {colors: number; wingSize: number}, initialColors = 3) {
	let count = 0

	createRoot(() => {
		createComputed(() => {
			b.colors
			b.wingSize
			count++
		})
	})

	expect(b.colors).toBe(initialColors, 'initial colors value')
	expect(b.wingSize).toBe(2, 'initial wingSize value')
	expect(count).toBe(1, 'Should be reactive')

	b.colors++

	expect(b.colors).toBe(initialColors + 1, 'incremented colors value')
	expect(count).toBe(2, 'Should be reactive')

	b.wingSize++

	expect(b.wingSize).toBe(3, 'incremented wingSize value')
	expect(count).toBe(3, 'Should be reactive')
}

export class MyElement extends Effectful(HTMLElement) {
	static {
		customElements.define('my-element', this)
	}

	@signal a = 1
	@signal b = 2

	runs = 0
	result = 0

	connectedCallback() {
		this.createEffect(() => {
			this.runs++
			this.result = this.a + this.b
		})
	}

	disconnectedCallback() {
		this.clearEffects()
	}
}

export class MyElement2 extends Effectful(HTMLElement) {
	static {
		customElements.define('my-element2', this)
	}

	@signal a = 1
	@signal b = 2

	runs = 0
	result = 0

	constructor() {
		super()
		this.createEffect(() => {
			this.runs++
			this.result = this.a + this.b
		})
	}

	connectedCallback() {
		this.startEffects()
	}

	disconnectedCallback() {
		this.stopEffects()
	}
}

export class MyElement3 extends Effectful(HTMLElement) {
	static {
		customElements.define('my-element3', this)
	}

	runs = 0
	result = 0

	@signal a = 1
	@signal b = 2

	@memo get sum() {
		return this.a + this.b
	}

	@effect log() {
		this.runs++
		this.result = this.sum
	}

	connectedCallback() {
		this.startEffects()
	}

	disconnectedCallback() {
		this.stopEffects()
	}
}
export class MyElement4 extends HTMLElement {
	static {
		customElements.define('my-element4', this)
	}

	runs = 0
	result = 0

	@signal a = 1
	@signal b = 2

	@memo get sum() {
		return this.a + this.b
	}

	@effect log() {
		this.runs++
		this.result = this.sum
	}

	connectedCallback() {
		startEffects(this)
	}

	disconnectedCallback() {
		stopEffects(this)
	}
}

export function testElementEffects(el: Element & {a: number; b: number; result: number; runs: number}) {
	document.body.append(el) // triggers connectedCallback

	expect(el.result).toBe(1 + 2)
	expect(el.runs).toBe(1)

	el.a = 5
	expect(el.result).toBe(5 + 2)
	expect(el.runs).toBe(2)

	el.b = 10
	expect(el.result).toBe(5 + 10)
	expect(el.runs).toBe(3)

	// disconnect the element

	document.body.removeChild(el) // triggers disconnectedCallback

	// Further signal changes do not affect result while disconnected
	el.a = 20
	el.b = 30
	expect(el.result).toBe(5 + 10)
	expect(el.runs).toBe(3)

	// reconnect the element
	document.body.append(el) // triggers connectedCallback
	expect(el.result).toBe(20 + 30)
	expect(el.runs).toBe(4)

	// further signal changes work again
	el.a = 100
	expect(el.result).toBe(100 + 30)
	expect(el.runs).toBe(5)
	el.b = 200
	expect(el.result).toBe(100 + 200)
	expect(el.runs).toBe(6)
}
