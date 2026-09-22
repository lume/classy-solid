import {runWithOwner} from 'solid-js'
import {getInheritedDescriptor} from 'lowclass/dist/getInheritedDescriptor.js'
import {getEffects__, isMemoGetter__, isSignalGetter__} from '../_state.js'
import type {AnyObject} from '../decorators/types.js'

const Undefined = Symbol()

/**
 * Convert properties on an object into Solid.js memoized properties.
 *
 * There are two ways to use this:
 *
 * 1. Define which properties to convert to memoized properties by providing
 * property names as trailing arguments. Properties that are not function-valued
 * or accessors will be ignored.
 * 2. If no property names are provided, all function-valued properties and
 * accessors on the object will be automatically converted to memoized
 * properties.
 *
 * If any property is already memoified with `memoify()`, or already signalified
 * with `signalify()`, it will be skipped.
 *
 * Example with a plain object:
 *
 * ```js
 * import {memoify, signalify} from 'classy-solid'
 * import {createEffect} from 'solid-js'
 *
 * const obj = {
 *   a: 1,
 *   b: 2,
 *   get sum() {
 *     return this.a + this.b
 *   }
 * }
 *
 * signalify(obj, 'a', 'b')
 * memoify(obj, 'sum')
 *
 * createEffect(() => {
 *   console.log('sum:', obj.sum)
 * })
 *
 * obj.a = 3 // updates sum to 5
 * ```
 *
 * Example with a class:
 *
 * ```js
 * import {memoify, signalify} from 'classy-solid'
 * import {createEffect} from 'solid-js'
 *
 * class Example {
 *   a = 1
 *   b = 2
 *
 *   get sum() {
 *     return this.a + this.b
 *   }
 *
 *   constructor() {
 *     signalify(this, 'a', 'b')
 *     memoify(this, 'sum')
 *   }
 * }
 *
 * const ex = new Example()
 *
 * createEffect(() => {
 *   console.log('sum:', ex.sum)
 * })
 *
 * ex.a = 3 // updates sum to 5
 * ```
 */
export function memoify<T extends object, K extends keyof T>(obj: T): T
export function memoify<T extends object>(obj: T, ...props: (keyof T)[]): T
export function memoify(obj: AnyObject, ...props: PropertyKey[]) {
	// If no props specified, use all keys (including symbols)
	const keys: PropertyKey[] = props.length ? props : [...Object.keys(obj), ...Object.getOwnPropertySymbols(obj)]

	// Memos are lazy and owned by the object's Effects instance (created here
	// if needed), so they are disposed with stopEffects(obj) and revived with
	// startEffects(obj), the same as @memo and @effect members. If `obj` is
	// itself Effectful, its own root is used.
	const effects = getEffects__(obj)

	// memoify() is normally called from a constructor or at top level, but if
	// it happens to run inside an effect the memos must still belong to `obj`,
	// not to that effect. runWithOwner(null) makes effects.createMemo() take
	// the Effectful-owned path regardless of the caller's owner.
	const createMemo = (fn: () => unknown) => runWithOwner(null, () => effects.createMemo(fn))!
	const createWritableMemo = (fn: () => unknown) => runWithOwner(null, () => effects.createWritableMemo(fn))!

	for (const key of keys) {
		const descriptor = getInheritedDescriptor(obj, key)
		if (!descriptor) continue

		// Skip if already memoified or signalified
		if (descriptor.get && (isMemoGetter__.has(descriptor.get) || isSignalGetter__.has(descriptor.get))) continue

		// Handle methods (function-valued properties)
		if (typeof descriptor.value === 'function') {
			const fn = descriptor.value as (this: unknown, val?: unknown) => unknown
			const name = fn.name || String(key)
			let value: (val?: unknown) => unknown

			// Readonly memo: arity 0
			if (fn.length === 0) {
				const get = createMemo(() => fn.call(obj))

				value = (val = Undefined) => {
					if (val === Undefined) return get()
					throw new Error(`Cannot set readonly memoized method "${String(key)}".`)
				}
			}
			// Writable memo: arity > 0
			else {
				const [get, set] = createWritableMemo(() => fn.call(obj))

				value = (val: unknown = Undefined) => {
					if (val === Undefined) return get()
					return set(typeof val === 'function' ? () => val : val)
				}
			}

			Object.defineProperty(value, 'name', {value: name, configurable: true})
			Object.defineProperty(obj, key, {value, configurable: true, enumerable: descriptor.enumerable})
			isMemoGetter__.add(value)
		}

		// Handle accessors
		else if (descriptor.get || descriptor.set) {
			if (!descriptor.get) throw new Error(`Cannot memoify accessor "${String(key)}" without a getter.`)

			const getter = descriptor.get
			let get: () => unknown
			let set: ((val: unknown) => void) | undefined

			// Readonly memo: getter only
			if (!descriptor.set) get = createMemo(() => getter.call(obj))
			// Writable memo: getter and setter
			else [get, set] = createWritableMemo(() => getter.call(obj))

			Object.defineProperty(get, 'name', {value: String(key), configurable: true})
			if (set) Object.defineProperty(set, 'name', {value: String(key), configurable: true})
			Object.defineProperty(obj, key, {
				get,
				set: set && (val => (typeof val === 'function' ? set!(() => val) : set!(val))),
				configurable: true,
				enumerable: descriptor.enumerable,
			})
			isMemoGetter__.add(get)
		}

		// Otherwise skip non-function, non-accessor properties (f.e. memoify(obj) in automatic mode on a plain object).
	}

	return obj
}
