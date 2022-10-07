import type {DecoratorArgs, PropKey, PropSpec} from './types.js'

let propsToSignalify = new Map<PropKey, PropSpec>()

let gotPropsToSignalify = false
export function getPropsToSignalify() {
	if (gotPropsToSignalify) throw new Error('Export "signalProps" is internal to classy-solid only.')
	gotPropsToSignalify = true
	return propsToSignalify
}

export const classFinishers: ((propsToSignalify: Map<PropKey, PropSpec>) => void)[] = []

/**
 * @decorator
 * Decorate properties of a class with `@signal` to back them with Solid
 * signals, making them reactive. Don't forget that the class in which `@signal`
 * is used must be decorated with `@reactive`.
 *
 * Example:
 *
 * > Note in the following example that `\@` should be written as `@` without
 * the back slash. The back slash prevents JSDoc parsing errors in this comment
 * in TypeScript.  https://github.com/microsoft/TypeScript/issues/47679
 *
 * ```js
 * import {reactive, signal} from 'classy-solid'
 * import {createEffect} from 'solid-js'
 *
 * \@reactive
 * class Counter {
 *   \@signal count = 0
 *
 *   constructor() {
 *     setInterval(() => this.count++, 1000)
 *   }
 * }
 *
 * const counter = new Counter
 *
 * createEffect(() => {
 *   console.log('count:', counter.count)
 * })
 * ```
 */
export function signal(...args: any[]): any {
	const [_, {kind, name, private: isPrivate, static: isStatic}] = args as DecoratorArgs

	let props = propsToSignalify

	// The function added here gets called by @reactive, which passes the final
	// set of props to signalify into here so that the field initializer can use
	// it.
	classFinishers.push(propsToSignalify => (props = propsToSignalify))

	if (isPrivate) throw new Error('@signal is not supported on private fields yet.')
	if (isStatic) throw new Error('@signal is not supported on static fields yet.')

	if (kind === 'field') {
		props.set(name, {initialValue: undefined})
		return function (this: object, initialValue: unknown) {
			props.get(name)!.initialValue = initialValue
			return initialValue
		}
	} else if (kind === 'accessor') {
		throw new Error('@signal not supported on `accessor` fields yet.')
	} else if (kind === 'getter' || kind === 'setter') {
		props.set(name, {initialValue: undefined})
	} else {
		throw new Error('The @signal decorator is only for use on fields, accessors, getters, and setters.')
	}

	queueReactiveDecoratorChecker()
}

let checkerQueued = false

function queueReactiveDecoratorChecker() {
	if (checkerQueued) return
	checkerQueued = true

	queueMicrotask(() => {
		checkerQueued = false

		if (propsToSignalify.size) {
			throw new Error(
				`Stray @signal-decorated properties detected: ${[...propsToSignalify.keys()].join(
					', ',
				)}. Did you forget to use the \`@reactive\` decorator on a class that has properties decorated with \`@signal\`?`,
			)
		}
	})
}
