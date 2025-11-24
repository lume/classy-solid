import type {AnyConstructor} from 'lowclass/dist/Constructor.js'
import {getListener, untrack} from 'solid-js'

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

			return instance
		}
	}

	return ReactiveDecorator
}
