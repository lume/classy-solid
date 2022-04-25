import {Constructor} from 'lowclass'
import {onMount, createEffect, Component, onCleanup, JSX} from 'solid-js'

// https://github.com/ryansolid/dom-expressions/pull/122

interface PossibleComponent {
	onMount?(): void
	onCleanup?(): void
	template?(props: Record<string, unknown>): JSX.Element
}
interface PossiblyReactiveConstructor {
	signalProperties: string[]
}

/**
 * A decorator for using classes as Solid components.
 *
 * Example (JS without types):
 *
 * ```js
 * @component
 * @reactive
 * class MyComp {
 *   @signal last = 'none'
 *
 *   onMount() {
 *     console.log('mounted')
 *   }
 *
 *   template(props) {
 *     // here we use `props` passed in, or the signal on `this` which is also
 *     // treated as a prop
 *     return <h1>Hello, my name is {props.first} {this.last}</h1>
 *   }
 * }
 *
 * render(() => <MyComp first="Joe" last="Pea" />)
 * ```
 */
export function component<T extends Constructor>(
	Base: T,
	// temporary hacky return type until we update Solid JSX types
): Component<{}> & T & {new (): {render: (props: any) => JSX.Element}} {
	const Class = Constructor<PossibleComponent, PossiblyReactiveConstructor>(Base)

	return ((props?: any): JSX.Element => {
		const instance = new Class()

		// for (const prop of Class.signalProperties ?? []) {
		for (const prop of Object.keys(instance) ?? []) {
			if (!(prop in props)) continue // need this? Can prop spread instroduce new props that we'll miss because of this?

			createEffect(() => {
				// @ts-expect-error
				instance[prop] = props[prop]
			})
		}

		if (instance.onMount) onMount(() => instance.onMount!())
		if (instance.onCleanup) onCleanup(() => instance.onCleanup!())

		return instance.template?.(props) ?? null
	}) as unknown as T & (() => JSX.Element) & {new (): {render: (props: any) => JSX.Element}} // temporary hacky cast to tell TypeScript to allow the decorator until we update Solid JSX types
}

declare module 'solid-js' {
	namespace JSX {
		// Tells JSX what properties class components should have.
		interface ElementClass {
			template?(props: Record<string, unknown>): JSX.Element
		}

		// Tells JSX where to look up prop types on class components.
		interface ElementAttributesProperty {
			PropTypes: {}
		}
	}
}

export type Props<T extends object, K extends keyof T> = Pick<T, K> & {
	children?: JSX.Element
}
