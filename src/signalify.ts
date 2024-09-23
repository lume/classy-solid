import {getInheritedDescriptor} from 'lowclass/dist/getInheritedDescriptor.js'
import {createSignal, $PROXY, untrack, type Signal} from 'solid-js'
import type {PropKey} from './decorators/types.js'

type AnyObject = Record<PropertyKey, unknown>

/**
 * Convert properties on an object into Solid signal-backed properties.
 *
 * There are two ways to use this: either by defining which properties to
 * convert to signal-backed properties by providing an array as property names
 * in the second arg, which is useful on plain objects, or by passing in `this`
 * and `this.constructor` within the `constructor` of a class that has
 * properties decorated with `@signal`.
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
export function signalify<T extends object>(obj: T, ...props: [key: keyof T, initialValue: unknown][]): T
export function signalify(obj: AnyObject, ...props: [key: PropertyKey, initialValue: unknown][] | PropertyKey[]) {
	// Special case for Solid proxies: if the object is already a solid proxy,
	// all properties are already reactive, no need to signalify.
	// @ts-expect-error special indexed access
	const proxy = obj[$PROXY] as T
	if (proxy) return obj

	const _props = props.length ? props : (Object.keys(obj) as PropKey[]).concat(Object.getOwnPropertySymbols(obj))

	// Use `untrack` here to be extra safe the initial value doesn't count as a
	// dependency and cause a reactivity loop.
	for (const prop of _props) {
		const isTuple = Array.isArray(prop)
		// We cast from PropertyKey to PropKey because keys can't actually be number, only string | symbol.
		const _prop = (isTuple ? prop[0] : prop) as PropKey
		const initialValue = isTuple ? prop[1] : untrack(() => obj[_prop])

		createSignalAccessor(obj, _prop, initialValue)
	}

	return obj
}

let gotCreateSignalAccessor = false

/**
 * This ensures that `createSignalAccessor` is kept internal to classy-solid only.
 */
export function getCreateSignalAccessor() {
	if (gotCreateSignalAccessor) throw new Error('Export "createSignalAccessor" is internal to classy-solid only.')
	gotCreateSignalAccessor = true
	return createSignalAccessor
}

// propsSetAtLeastOnce is a Set that tracks which reactive properties have been
// set at least once.
const propsSetAtLeastOnce = new WeakMap<object, Set<string | symbol>>()

// @lume/element uses this to detect if a reactive prop has been set, and if so
// will not overwrite the value with any pre-existing value from custom element
// pre-upgrade.
export function __isPropSetAtLeastOnce(instance: object, prop: string | symbol) {
	return !!propsSetAtLeastOnce.get(instance)?.has(prop)
}

function trackPropSetAtLeastOnce(instance: object, prop: string | symbol) {
	if (!propsSetAtLeastOnce.has(instance)) propsSetAtLeastOnce.set(instance, new Set())
	propsSetAtLeastOnce.get(instance)!.add(prop)
}

const isSignalGetter = new WeakSet<Function>()

function createSignalAccessor<T extends object>(obj: T, prop: Exclude<keyof T, number>, initialVal: unknown): void {
	let descriptor: PropertyDescriptor | undefined = getInheritedDescriptor(obj, prop)

	let originalGet: (() => any) | undefined
	let originalSet: ((v: any) => void) | undefined

	if (descriptor) {
		originalGet = descriptor.get
		originalSet = descriptor.set

		if (originalGet && isSignalGetter.has(originalGet)) return

		if (originalGet || originalSet) {
			// reactivity requires both
			if (!originalGet || !originalSet) return warnNotReadWrite(prop)

			delete descriptor.get
			delete descriptor.set
		} else {
			// If there was a value descriptor, trust it as the source of truth
			// for initialVal. For example, if the user class modifies the value
			// after the initializer, it will have a different value than what
			// we tracked from the initializer.
			initialVal = descriptor.value

			// if it isn't writable, we don't need to make a reactive variable because
			// the value won't change
			if (!descriptor.writable) return warnNotWritable(prop)

			delete descriptor.value
			delete descriptor.writable
		}
	}

	const signalStorage = new WeakMap<object, Signal<unknown>>()

	descriptor = {
		configurable: true,
		enumerable: true,
		...descriptor,
		get: originalGet
			? function (this: object): unknown {
					const s = getSignal(this, signalStorage, initialVal)
					s[0]() // read
					return originalGet!.call(this)
			  }
			: function (this: object): unknown {
					const s = getSignal(this, signalStorage, initialVal)
					return s[0]() // read
			  },
		set: originalSet
			? function (this: object, newValue: unknown) {
					originalSet!.call(this, newValue)

					trackPropSetAtLeastOnce(this, prop)

					// write
					const s = getSignal(this, signalStorage, initialVal)
					if (typeof newValue === 'function') s[1](() => newValue)
					else s[1](newValue)
			  }
			: function (this: object, newValue: unknown) {
					trackPropSetAtLeastOnce(this, prop)

					// write
					const s = getSignal(this, signalStorage, initialVal)
					if (typeof newValue === 'function') s[1](() => newValue)
					else s[1](newValue)
			  },
	}

	isSignalGetter.add(descriptor.get!)

	Object.defineProperty(obj, prop, descriptor)
}

function getSignal(obj: object, storage: WeakMap<object, Signal<unknown>>, initialVal: unknown) {
	let s = storage.get(obj)
	if (!s) storage.set(obj, (s = createSignal(initialVal, {equals: false})))
	return s
}

function warnNotReadWrite(prop: PropertyKey) {
	console.warn(
		`Cannot signalify property named "${String(
			prop,
		)}" which had a getter or a setter, but not both. Reactivity on accessors works only when accessors have both get and set. Skipped.`,
	)
}

function warnNotWritable(prop: PropertyKey) {
	console.warn(
		`The \`@signal\` decorator was used on a property named "${String(
			prop,
		)}" that is not writable. Reactivity is not enabled for non-writable properties.`,
	)
}
