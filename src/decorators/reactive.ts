import type {AnyConstructor} from 'lowclass/dist/Constructor.js'
import {getListener, untrack} from 'solid-js'
import {getKey, getPropsToSignalify, resetPropsToSignalify} from './signal.js'
import {getCreateSignalAccessor} from '../signalify.js'

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
 * ```js
 * import {reactive, signal} from 'classy-solid'
 * import {createEffect} from 'solid-js'
 *
 * ⁣@reactive
 * class Counter {
 *   ⁣@signal count = 0
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
export function reactive(value: AnyConstructor, context: ClassDecoratorContext | undefined): any {
	// context may be undefined when unsing reactive() without decorators
	if (typeof value !== 'function' || (context && context.kind !== 'class'))
		throw new TypeError('The @reactive decorator is only for use on classes.')

	const Class = value
	const signalProps = getPropsToSignalify(accessKey)

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

			// Ensure that if we're in an effect that `new`ing a class does not
			// track signal reads, otherwise we'll get into an infinite loop. If
			// someone want to trigger an effect based on properties of the
			// `new`ed instance, they can explicitly read the properties
			// themselves in the effect, making their intent clear.
			if (getListener()) untrack(() => (instance = Reflect.construct(Class, args, new.target))) // super()
			else super(...args), (instance = this)

			for (const [prop, {initialValue}] of signalProps) {
				// @prod-prune
				if (!(hasOwnProperty.call(instance, prop) || hasOwnProperty.call(Class.prototype, prop))) {
					throw new Error(
						`Property "${prop.toString()}" not found on instance of class decorated with \`@reactive\`. Did you forget to use the \`@reactive\` decorator on one of your classes that has a "${prop.toString()}" property decorated with \`@signal\`?`,
					)
				}

				// For now at least, we always override like class fields with
				// [[Define]] semantics. Perhaps when @signal is used on a
				// getter/setter, we should not override in that case, but patch
				// the prototype getter/setter (that'll be a bit of work to
				// implement though).
				const override = true

				createSignalAccessor(instance, prop as Exclude<keyof ReactiveDecorator, number>, initialValue, override)
			}

			return instance
		}
	}

	return ReactiveDecorator
}
