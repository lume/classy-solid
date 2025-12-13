import {signal, effect} from './index.js'
import {createEffect} from 'solid-js'

class Foo {
	@signal foo = 123

	@signal get lorem() {
		return 123
	}
	@signal set lorem(v) {
		v
	}
}

class Bar extends Foo {
	// This causes a TDZ error if it comes after bar. See "TDZ" example in signal.test.ts.
	// Spec ordering issue: https://github.com/tc39/proposal-decorators/issues/571
	#baz = 789

	@signal bar = 456

	// This would cause a TDZ error.
	// #baz = 789

	@signal get baz() {
		return this.#baz
	}
	@signal set baz(v) {
		this.#baz = v
	}

	@effect logFoo() {
		console.log('this.foo:', this.foo)
	}

	@effect logLorem() {
		console.log('this.lorem:', this.lorem)
	}

	@effect logBar() {
		console.log('this.bar:', this.bar)
	}

	@effect logBaz() {
		console.log('this.baz:', this.baz)
	}
}

export {Foo}

console.log('---------')
const b = new Bar()

createEffect(() => {
	console.log('b.foo:', b.foo)
})

createEffect(() => {
	console.log('b.lorem:', b.lorem)
})

createEffect(() => {
	console.log('b.bar:', b.bar)
})

createEffect(() => {
	console.log('b.baz:', b.baz)
})

setInterval(() => {
	console.log('---')
	b.foo++
	b.bar++
	b.baz++
	b.lorem++
}, 1000)
