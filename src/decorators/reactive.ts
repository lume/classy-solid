import type {Constructor} from 'lowclass'
import {getListener, untrack} from 'solid-js'
import {getKey, getPropsToSignalify, resetPropsToSignalify} from './signal.js'
import {getCreateSignalAccessor} from '../signalify.js'
import type {DecoratedValue, DecoratorContext} from './types.js'

/**
 * Access key for classy-solid private internal APIs.
 */
const accessKey = getKey()

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
	const [value, context] = args as [DecoratedValue, DecoratorContext]

	if (typeof value !== 'function' || (context && context.kind !== 'class'))
		throw new TypeError('The @reactive decorator is only for use on classes.')

	const Class = value as Constructor
	const props = getPropsToSignalify(accessKey)

	// For the current class decorated with @reactive, we reset the map, so that
	// for the next class decorated with @reactive we track only that next
	// class's properties that were decorated with @signal. We do this because
	// field decorators do not have access to the class or its prototype.
	//
	// In the future maybe we can use decorator metadata for this
	// (https://github.com/tc39/proposal-decorator-metadata)?
	resetPropsToSignalify(accessKey)

	class ReactiveDecorator extends Class {
		constructor(...args: any[]) {
			let instance!: ReactiveDecorator

			if (getListener()) untrack(() => (instance = Reflect.construct(Class, args, new.target))) // super()
			else super(...args), (instance = this)

			for (const [prop, {initialValue}] of props) {
				// @prod-prune
				if (!(hasOwnProperty.call(instance, prop) || hasOwnProperty.call(Class.prototype, prop))) {
					throw new Error(
						`Property "${prop.toString()}" not found on instance of class decorated with \`@reactive\`. Did you forget to use the \`@reactive\` decorator on one of your classes that has a "${prop.toString()}" property decorated with \`@signal\`?`,
					)
				}

				createSignalAccessor(instance, prop as Exclude<keyof ReactiveDecorator, number>, initialValue)
			}

			return instance
		}
	}

	return ReactiveDecorator
}
