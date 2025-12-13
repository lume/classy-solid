import {createEffect} from 'solid-js'
import {signal} from './signal.js'
import {untracked} from './untracked.js'
import {memo} from './memo.js'
import {reactive} from './reactive.js'

describe('Reactivity Tracking in Constructors', () => {
	it('automatically does not track reactivity in constructors when using @untracked', () => {
		@untracked
		class Foo {
			@signal amount = 3
		}

		@untracked
		class Bar extends Foo {
			@signal double = 0

			constructor() {
				super()
				this.double = this.amount * 2 // this read of .amount should not be tracked
			}
		}

		let b: Bar
		let count = 0

		function noLoop() {
			createEffect(() => {
				b = new Bar() // this should not track
				count++
			})
		}

		expect(noLoop).not.toThrow()
		expect(count).toBe(1)

		const b2 = b!

		b!.amount = 4 // hence this should not trigger

		// If the effect ran only once initially, not when setting b.colors,
		// then both variables should reference the same instance
		expect(count).toBe(1)
		expect(b!).toBe(b2)
	})

	// deprecated
	it('automatically does not track reactivity in constructors when using @reactive', () => {
		@reactive
		class Foo {
			@signal amount = 3
		}

		@reactive
		class Bar extends Foo {
			@signal double = 0

			constructor() {
				super()
				this.double = this.amount * 2 // this read of .amount should not be tracked
			}
		}

		let b: Bar
		let count = 0

		function noLoop() {
			createEffect(() => {
				b = new Bar() // this should not track
				count++
			})
		}

		expect(noLoop).not.toThrow()
		expect(count).toBe(1)

		const b2 = b!

		b!.amount = 4 // hence this should not trigger

		// If the effect ran only once initially, not when setting b.colors,
		// then both variables should reference the same instance
		expect(count).toBe(1)
		expect(b!).toBe(b2)
	})

	it('automatically does not track reactivity in constructors when using @memo', () => {
		class Foo {
			@signal amount = (() => {
				debugger
				return 3
			})()

			// @signal accessor yo = 123

			// @signal get bar() {
			// 	return this
			// }
			// @signal set bar(v) {
			// 	// do nothing
			// }
		}

		class Bar extends Foo {
			@memo get double() {
				return this.amount * 2
			}
		}

		let b: Bar
		let count = 0

		function noLoop() {
			createEffect(() => {
				b = new Bar() // this should not track
				count++
			})
		}

		expect(noLoop).not.toThrow()
		expect(count).toBe(1)

		const b2 = b!

		b!.amount = 4 // hence this should not trigger

		// If the effect ran only once initially, not when setting b.colors,
		// then both variables should reference the same instance
		expect(count).toBe(1)
		expect(b!).toBe(b2)
	})
})
