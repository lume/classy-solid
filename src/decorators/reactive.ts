import {AnyClassWithReactiveProps, signalify} from '../signalify.js'

/**
 * A decorator that makes a class reactive, allowing it have properties
 * decorated with `@signal` to make those properties reactive Solid signals.
 *
 * Example:
 *
 * ```js
 * @reactive
 * class Counter {
 *   @signal count = 0
 *
 *   constructor() {
 *     setInterval(() => this.count++, 1000)
 *   }
 * }
 *
 * const counter = new Counter
 *
 * createEffect(() => {
 *   // This effect automatically re-runs any time counter.count has changed, once per second.
 *   console.log('count:', counter.count)
 * })
 * ```
 */

// TODO handle v4 decorators (v3 was skipped)
export function reactive(classOrClassElement: any): any {
	// If used as a newer Babel decorator
	const isDecoratorV2 = arguments.length === 1 && 'kind' in classOrClassElement
	if (isDecoratorV2) {
		const classElement = classOrClassElement

		// If used as a class decorator.
		if (classElement.kind === 'class') return {...classElement, finisher: reactiveClassFinisher}
		return classElement
	}

	// Used as a v1 legacy decorator.

	// If used as a class decorator.
	if (arguments.length === 1 && typeof classOrClassElement === 'function') {
		const Class = classOrClassElement
		return reactiveClassFinisher(Class)
	}
}

function reactiveClassFinisher(Class: AnyClassWithReactiveProps) {
	if (Class.hasOwnProperty('__isReactive__')) return Class

	return class ReactiveDecoratorFinisher extends Class {
		// This is a flag that other decorators can check, f.e. lume/elements @element decorator.
		static __isReactive__: true = true

		constructor(...args: any[]) {
			super(...args)
			signalify(this, Class)
		}
	}
}
