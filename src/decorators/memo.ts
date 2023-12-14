import type {PropKey, PropSpec} from './types.js'

let propsToMemoize = new Map<PropKey, PropSpec>()
let accessKey: symbol | null = null

/**
 * Provides a key for accessing internal APIs. If any other module tries to get
 * this, an error will be thrown, and decorators will not work.
 */
export function getMemoModuleKey() {
	if (accessKey) throw new Error('Attempted use of classy-solid internals.')
	accessKey = Symbol()
	return accessKey
}

/**
 * This function provides propsToMemoize to only one external module
 * (reactive.ts). The purpose of this is to keep the API private for reactive.ts
 * only, otherwise an error will be thrown that breaks decorators.
 */
export function getPropsToMemoize(key: symbol) {
	if (key !== accessKey) throw new Error('Attempted use of classy-solid internals.')
	return propsToMemoize
}

/**
 * Only the module that first gets the key can call this function (it should be
 * reactive.ts)
 */
export function resetPropsToMemoize(key: symbol) {
	if (key !== accessKey) throw new Error('Attempted use of classy-solid internals.')
	propsToMemoize = new Map<PropKey, PropSpec>()
}

function isMemberDecorator(context: DecoratorContext): context is ClassMemberDecoratorContext {
	return !!('private' in context)
}

/**
 * @decorator
 * Use the `@memo` decorator to define a property whose value is derived from
 * other properties in a more performant way than just a getter. A plain getter
 * will always re-calculate the derived value when accessed, whereas a memoized
 * property will update its value only if dependencies have changed.
 *
 * Related: Solid.js `createMemo` API, which is used in the underlying
 * implementation of the decorator.
 *
 * Example:
 *
 * ```js
 * import {reactive, signal, memo} from 'classy-solid'
 * import {createEffect} from 'solid-js'
 *
 * ⁣@reactive
 * class Counter {
 *   ⁣@signal count = 0
 *   ⁣@memo double = this.count * 2
 *
 *   constructor() {
 *     setInterval(() => this.count++, 1000)
 *   }
 * }
 *
 * const counter = new Counter
 *
 * createEffect(() => {
 *   // This re-runs any time counter.count changes because it is a dependency of counter.double.
 *   console.log('double:', counter.double)
 * })
 * ```
 */
export function memo(
	_: unknown,
	context: ClassFieldDecoratorContext | ClassGetterDecoratorContext | ClassSetterDecoratorContext,
): any {
	const {kind, name: _name} = context
	const props = propsToMemoize

	if (isMemberDecorator(context)) {
		if (context.private) throw new Error('@memo is not supported on private fields yet.')
		if (context.static) throw new Error('@memo is not supported on static fields yet.')
	}

	// TODO
	if (kind === 'field') {
		//
	} else if (kind === 'getter' || kind === 'setter') {
		//
	} else {
		throw new Error(
			'The @memo decorator is only for use on fields, getters, and setters. Auto accessor support is coming next if there is demand for it.',
		)
	}

	// @prod-prune
	queueReactiveDecoratorChecker(props)
}

let checkerQueued = false

/**
 * This throws an error in some cases of an end dev forgetting to decorate a
 * class with `@reactive` if they used `@memo` on that class's fields.
 *
 * This doesn't work all the time, only when the very last class decorated is
 * missing @reactive, but something is better than nothing. There's another
 * similar check performed in the `@reactive` decorator.
 */
function queueReactiveDecoratorChecker(props: Map<PropKey, PropSpec>) {
	if (checkerQueued) return
	checkerQueued = true

	queueMicrotask(() => {
		checkerQueued = false

		// If the refs are still equal, it means @reactive did not run (forgot
		// to decorate a class that uses @memo with @reactive).
		if (props === propsToMemoize) {
			throw new Error(
				// Array.from(map.keys()) instead of [...map.keys()] because it breaks in Oculus browser.
				`Stray @memo-decorated properties detected: ${Array.from(props.keys()).join(
					', ',
				)}. Did you forget to use the \`@reactive\` decorator on a class that has properties decorated with \`@memo\`?`,
			)
		}
	})
}
