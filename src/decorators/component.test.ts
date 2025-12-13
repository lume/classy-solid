import html from 'solid-js/html'
import {component, type Props} from './component.js'
import {render} from 'solid-js/web'
import {signal} from './signal.js'
import {createSignal} from 'solid-js'
import {createSignalFunction} from '../signals/createSignalFunction.js'
import {signalify} from '../signals/signalify.js'
import {createMutable} from 'solid-js/store'
import {memo} from './memo.js'
import {effect} from './effect.js'

describe('classy-solid', () => {
	describe('@component', () => {
		it('allows to define a class using class syntax', () => {
			let onMountCalled = false
			let onCleanupCalled = false

			@component
			class CoolComp {
				declare PropTypes: Props<this, 'foo'>

				@signal foo = 0

				onMount() {
					onMountCalled = true
				}

				onCleanup() {
					onCleanupCalled = true
				}

				template(props: this['PropTypes']) {
					expect(props.foo).toBe(123) // not recommended to access props this way

					expect(this.foo).toBe(0) // initial value only

					return html`<div>hello classes! ${() => this.foo}</div>`
				}
			}

			// Component classes cannot be instantiated directly, they can only
			// be used as Solid components in JSX or html templates.
			expect(() => new CoolComp()).toThrow()

			const root = document.createElement('div')
			document.body.append(root)

			const dispose = render(() => html`<${CoolComp} foo=${123} />`, root)

			expect(root.textContent).toBe('hello classes! 123')
			expect(onMountCalled).toBe(true)
			expect(onCleanupCalled).toBe(false)

			dispose()
			root.remove()

			expect(onCleanupCalled).toBe(true)
		})

		it('throws on invalid use', () => {
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

		it('allows getting a ref to the class instance', () => {
			@component
			class CoolComp {
				coolness = Infinity
				template = () => html`<div>hello refs!</div>`
			}

			const root = document.createElement('div')
			document.body.append(root)

			let compRef!: CoolComp

			const dispose = render(() => html`<${CoolComp} ref=${(comp: CoolComp) => (compRef = comp)} />`, root)

			expect(root.textContent).toBe('hello refs!')
			expect(compRef instanceof CoolComp).toBe(true)
			expect(compRef.coolness).toBe(Infinity)

			dispose()
			root.remove()
		})

		it('works in tandem with @signal, @memo, and @effect for reactivity', async () => {
			@component
			class CoolComp {
				declare PropTypes: Props<this, 'foo' | 'bar'>

				@signal foo = 0
				@signal bar = 0

				@memo get sum() {
					return this.foo + this.bar
				}

				runs = 0
				result = 0
				@effect logSum() {
					this.runs++
					this.result = this.sum
				}

				template() {
					return html`<div>foo: ${() => this.foo}, bar: ${() => this.bar}</div>`
				}
			}

			const root = document.createElement('div')
			document.body.append(root)

			const [a, setA] = createSignal(1)
			const b = createSignalFunction(2)

			let compRef!: CoolComp

			// FIXME Why do we need `() => b()` instead of just `b` here? Does `html`
			// check the `length` of the function and do something based on
			// that? Or does it get passed to a @signal property's setter and
			// receives the previous value?
			const dispose = render(
				() => html` <${CoolComp} ref=${(comp: CoolComp) => (compRef = comp)} foo=${a} bar=${() => b()} /> `,
				root,
			)

			expect(root.textContent).toBe('foo: 1, bar: 2')
			expect(compRef.result).toBe(3)
			expect(compRef.runs).toBe(2) // 1 initial run with 0 and 0, 1 run from setting foo and bar props

			setA(3)
			expect(root.textContent).toBe('foo: 3, bar: 2')
			expect(compRef.result).toBe(5)
			expect(compRef.runs).toBe(3)

			b(4)
			expect(root.textContent).toBe('foo: 3, bar: 4')
			expect(compRef.result).toBe(7)
			expect(compRef.runs).toBe(4)

			dispose()
			root.remove()
			setA(5)
			b(6)
			expect(compRef.result).toBe(7) // no change after dispose
			expect(compRef.runs).toBe(4) // no change after dispose
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

		// FIXME not working, spread syntax not supported yet in solid-js/html
		// TODO unit test using JSX
		it.skip('works with reactive spreads', async () => {
			@component
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
