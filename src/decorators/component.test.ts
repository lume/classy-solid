import html from 'solid-js/html'
import {component} from './component.js'
import {render} from 'solid-js/web'
import {reactive} from './reactive.js'
import {signal} from './signal.js'
import {createSignal} from 'solid-js'
import {createSignalFunction} from '../signals/createSignalFunction.js'
import {signalify} from '../signals/signalify.js'
import {createMutable} from 'solid-js/store'

describe('classy-solid', () => {
	describe('@component', () => {
		it('allows to define a class using class syntax', () => {
			let onMountCalled = false
			let onCleanupCalled = false

			@component
			class CoolComp {
				onMount() {
					onMountCalled = true
				}

				onCleanup() {
					onCleanupCalled = true
				}

				template(props: any) {
					expect(props.foo).toBe(123)
					return html`<div>hello classes!</div>`
				}
			}

			const root = document.createElement('div')
			document.body.append(root)

			const dispose = render(() => html`<${CoolComp} foo=${123} />`, root)

			expect(root.textContent).toBe('hello classes!')
			expect(onMountCalled).toBe(true)
			expect(onCleanupCalled).toBe(false)

			dispose()
			root.remove()

			expect(onCleanupCalled).toBe(true)

			// throws on non-class use
			expect(() => {
				class CoolComp {
					// @ts-ignore
					@component
					onMount() {}
				}
				CoolComp
			}).toThrow('component decorator should only be used on a class')
		})

		it('works in tandem with @reactive and @signal for reactivity', async () => {
			@component
			@reactive
			class CoolComp {
				@signal foo = 0
				@signal bar = 0

				template() {
					return html`<div>foo: ${() => this.foo}, bar: ${() => this.bar}</div>`
				}
			}

			const root = document.createElement('div')
			document.body.append(root)

			const [a, setA] = createSignal(1)
			const b = createSignalFunction(2)

			// FIXME Why do we need `() => b()` instead of just `b` here? Does `html`
			// check the `length` of the function and do something based on
			// that? Or does it get passed to a @signal property's setter and
			// receives the previous value?
			const dispose = render(() => html`<${CoolComp} foo=${a} bar=${() => b()} />`, root)

			expect(root.textContent).toBe('foo: 1, bar: 2')

			setA(3)
			b(4)

			expect(root.textContent).toBe('foo: 3, bar: 4')

			dispose()
			root.remove()
		})

		it('works without decorators', () => {
			const CoolComp = component(
				class CoolComp {
					foo = 0
					bar = 0

					constructor() {
						signalify(this)
					}

					template() {
						return html`<div>foo: ${() => this.foo}, bar: ${() => this.bar}</div>`
					}
				},
			)

			const root = document.createElement('div')
			document.body.append(root)

			const [a, setA] = createSignal(1)
			const b = createSignalFunction(2)

			// FIXME Why do we need `() => b()` instead of just `b` here? Does `html`
			// check the `length` of the function and do something based on
			// that? Or does it get passed to a @signal property's setter and
			// receives the previous value?
			const dispose = render(() => html`<${CoolComp} foo=${a} bar=${() => b()} />`, root)

			expect(root.textContent).toBe('foo: 1, bar: 2')

			setA(3)
			b(4)

			expect(root.textContent).toBe('foo: 3, bar: 4')

			dispose()
			root.remove()
		})

		// FIXME not working, the spread doesn't seem to do anything.
		xit('works with reactive spreads', async () => {
			@component
			@reactive
			class CoolComp {
				@signal foo = 0
				@signal bar = 0

				template() {
					return html`<div>foo: ${() => this.foo}, bar: ${() => this.bar}</div>`
				}
			}

			const root = document.createElement('div')
			document.body.append(root)

			let o = createMutable<any>({o: {foo: 123}})

			// neither of these work
			// const dispose = render(() => html`<${CoolComp} ...${() => o.o} />`, root)
			const dispose = render(() => html`<${CoolComp} ...${o.o} />`, root)

			expect(root.textContent).toBe('foo: 123, bar: 0')

			o.o = {bar: 456}

			expect(root.textContent).toBe('foo: 123, bar: 456')

			dispose()
			root.remove()
		})
	})
})
