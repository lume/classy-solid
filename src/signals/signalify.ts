import {getInheritedDescriptor} from 'lowclass/dist/getInheritedDescriptor.js'
import {$PROXY, untrack} from 'solid-js'
import type {PropKey} from '../decorators/types.js'
import {createSignalFunction, type SignalFunction} from './createSignalFunction.js'
import {isMemoGetter, isSignalGetter} from '../_state.js'

type AnyObject = Record<PropertyKey, unknown>

/**
 * Convert properties on an object into Solid signal-backed properties.
 *
 * There are two ways to use this:
 *
 * 1. Define which properties to convert to signal-backed properties by
 * providing property names as trailing arguments. Properties that are
 * function-valued (methods) are included as values of the signal properties.
 * 2. If no property names are provided, all non-function-valued properties on
 * the object will be automatically converted to signal-backed properties.
 *
 * If any property is already memoified with `memoify()`, or already signalified
 * with `signalify()`, it will be skipped.
 *
 * Example with a class:
 *
 * ```js
 * import {signalify} from 'classy-solid'
 * import {createEffect} from 'solid-js'
 *
 * class Counter {
 *   count = 0
 *
 *   constructor() {
 *     signalify(this, 'count')
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
 *
 * Example with a plain object:
 *
 * ```js
 * import {signalify} from 'classy-solid'
 * import {createEffect} from 'solid-js'
 *
 * const counter = {
 *   count: 0
 * }
 *
 * signalify(counter, 'count')
 * setInterval(() => counter.count++, 1000)
 *
 * createEffect(() => {
 *   console.log('count:', counter.count)
 * })
 * ```
 */
export function signalify<T extends object, K extends keyof T>(obj: T): T
export function signalify<T extends object>(obj: T, ...props: (keyof T)[]): T
/** This overload is for initial value support for downstream use cases. */
export function signalify<T extends object>(obj: T, ...props: [key: keyof T, initialValue: unknown][]): T
export function signalify(obj: AnyObject, ...props: [key: PropertyKey, initialValue: unknown][] | PropertyKey[]) {
	// Special case for Solid proxies: if the object is already a solid proxy,
	// all properties are already reactive, no need to signalify.
	// @ts-expect-error special indexed access
	const proxy = obj[$PROXY] as T
	if (proxy) return obj

	const skipFunctionProperties = props.length === 0

	const _props = props.length ? props : (Object.keys(obj) as PropKey[]).concat(Object.getOwnPropertySymbols(obj))

	// Use `untrack` here to be extra safe the initial value doesn't count as a
	// dependency and cause a reactivity loop.
	for (const prop of _props) {
		const isTuple = Array.isArray(prop)
		// We cast from PropertyKey to PropKey because keys can't actually be number, only string | symbol.
		const _prop = (isTuple ? prop[0] : prop) as PropKey
		const initialValue = isTuple ? prop[1] : untrack(() => obj[_prop])

		createSignalAccessor__(obj, _prop, initialValue, skipFunctionProperties)
	}

	return obj
}

// propsSetAtLeastOnce is a Set that tracks which reactive properties have been
// set at least once.
const propsSetAtLeastOnce = new WeakMap<object, Set<string | symbol>>()

// @lume/element uses this to detect if a reactive prop has been set, and if so
// will not overwrite the value with any pre-existing value from custom element
// pre-upgrade.
export function isPropSetAtLeastOnce__(instance: object, prop: string | symbol) {
	return !!propsSetAtLeastOnce.get(instance)?.has(prop)
}

export function trackPropSetAtLeastOnce__(instance: object, prop: string | symbol) {
	if (!propsSetAtLeastOnce.has(instance)) propsSetAtLeastOnce.set(instance, new Set())
	propsSetAtLeastOnce.get(instance)!.add(prop)
}

export function createSignalAccessor__<T extends object>(
	obj: T,
	prop: Exclude<keyof T, number>,
	initialVal: unknown,
	skipFunctionProperties = false,
): void {
	let descriptor: PropertyDescriptor | undefined = getInheritedDescriptor(obj, prop)

	let originalGet: (() => any) | undefined
	let originalSet: ((v: any) => void) | undefined
	const isAccessor = !!(descriptor?.get || descriptor?.set)

	if (descriptor) {
		if (skipFunctionProperties && typeof descriptor.value === 'function') return

		originalGet = descriptor.get
		originalSet = descriptor.set

		// If the original getter is already a signal getter, skip re-signalifying.
		if (originalGet && isSignalGetter.has(originalGet)) return

		// If the original getter is already a memo getter, skip signalifying.
		if (originalGet && isMemoGetter.has(originalGet)) return

		// Signals require both getter and setter to work properly.
		if (isAccessor && !(originalGet && originalSet)) return

		if (!isAccessor) {
			// No need to make a signal that can't be written to.
			if (!descriptor.writable) return warnNotWritable(prop)

			// If there was a value descriptor, trust it as the source of truth
			// for initialVal. For example, if the user class modifies the value
			// after the initializer, it will have a different value than what
			// we tracked from the initializer.
			initialVal = descriptor.value
		}
	}

	const signalStorage = new WeakMap<object, SignalFunction<unknown>>()

	const newDescriptor = {
		configurable: true,
		enumerable: descriptor?.enumerable,
		get: isAccessor
			? function (this: object): unknown {
					getSignal__(this, signalStorage, initialVal)()
					return originalGet!.call(this)
			  }
			: function (this: object): unknown {
					return getSignal__(this, signalStorage, initialVal)()
			  },
		set: isAccessor
			? function (this: object, newValue: unknown) {
					originalSet!.call(this, newValue)
					trackPropSetAtLeastOnce__(this, prop)

					const s = getSignal__(this, signalStorage, initialVal)
					s(typeof newValue === 'function' ? () => newValue : newValue)
			  }
			: function (this: object, newValue: unknown) {
					trackPropSetAtLeastOnce__(this, prop)

					const s = getSignal__(this, signalStorage, initialVal)
					s(typeof newValue === 'function' ? () => newValue : newValue)
			  },
	}

	isSignalGetter.add(newDescriptor.get!)

	Object.defineProperty(obj, prop, newDescriptor)
}

export function getSignal__(obj: object, storage: WeakMap<object, SignalFunction<unknown>>, initialVal: unknown) {
	let s = storage.get(obj)
	if (!s) storage.set(obj, (s = createSignalFunction(initialVal, {equals: false})))
	return s
}

function warnNotWritable(prop: PropertyKey) {
	console.warn(
		`The \`@signal\` decorator was used on a property named "${String(
			prop,
		)}" that is not writable. Reactivity is not enabled for non-writable properties.`,
	)
}
