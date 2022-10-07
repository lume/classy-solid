import type {Constructor} from 'lowclass'
import {classFinishers, getPropsToSignalify} from './signal.js'
import {getCreateSignalAccessor} from '../signalify.js'
import type {DecoratedValue, DecoratorContext} from './types.js'

const propsToSignalify = getPropsToSignalify()
const createSignalAccessor = getCreateSignalAccessor()

const hasOwnProperty = Object.prototype.hasOwnProperty

/**
 * A decorator that makes a class reactive, allowing it have properties
 * decorated with `@signal` to make those properties reactive Solid signals.
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
export function reactive(...args: any[]): any {
	const [value, {kind}] = args as [DecoratedValue, DecoratorContext]

	if (kind !== 'class') throw new TypeError('The @reactive decorator is only for use on classes.')

	const props = new Map(propsToSignalify)
	propsToSignalify.clear()

	// When these are called, each of the `@signal` decorators of the decorated
	// class will have the final list of props to signalify.
	for (const finisher of classFinishers) finisher(props)
	classFinishers.length = 0

	return class Reactive extends (value as Constructor) {
		constructor(...args: any[]) {
			super(...args)

			for (const [prop, {initialValue}] of props) {
				// @prod-prune
				if (!(hasOwnProperty.call(this, prop) || hasOwnProperty.call((value as Constructor).prototype, prop))) {
					throw new Error(
						`Property "${prop.toString()}" not found on object. Did you forget to use the \`@reactive\` decorator on a class that has properties decorated with \`@signal\`?`,
					)
				}

				createSignalAccessor(this, prop as Exclude<keyof this, number>, initialValue)
			}
		}
	}
}
