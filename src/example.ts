import {signal, reactive} from './index.js'
import {createEffect} from 'solid-js'

@reactive
class Other {
	@signal yoo = 'hoo'
}

new Other()

@reactive
class Foo {
	@signal foo = 123

	@signal get lorem() {
		return 123
	}
	set lorem(v) {
		v
	}
}

@reactive
class Bar extends Foo {
	@signal bar = 456

	#baz = 789

	@signal
	get baz() {
		return this.#baz
	}
	set baz(v) {
		this.#baz = v
	}

	constructor() {
		super()

		console.log('Bar')
	}
}

export {Foo}

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
