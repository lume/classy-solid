import {createMemo} from 'solid-js'
import {createWritableMemo} from '@solid-primitives/memo'
import {getInheritedDescriptor} from 'lowclass/dist/getInheritedDescriptor.js'
import {isMemoGetter, isSignalGetter} from './_state.js'

type AnyObject = Record<PropertyKey, unknown>

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
/** This overload is for use by the @memo decorator */
export function memoify<T extends object>(obj: T, isAutoAccessor: boolean, ...props: (keyof T)[]): T
export function memoify(obj: AnyObject, propOrBoolean?: PropertyKey | boolean, ...props: PropertyKey[]) {
	const isAutoAccessor = typeof propOrBoolean === 'boolean' ? propOrBoolean : false

	props =
		typeof propOrBoolean === 'boolean'
			? props
			: typeof propOrBoolean !== 'undefined'
			? [propOrBoolean, ...props]
			: props

	// If no props specified, use all keys (including symbols)
	const keys: PropertyKey[] = props.length ? props : [...Object.keys(obj), ...Object.getOwnPropertySymbols(obj)]

	for (const key of keys) {
		const descriptor = getInheritedDescriptor(obj, key)

		if (!descriptor) continue

		// Skip if already memoified or signalified
		if (descriptor.get && (isMemoGetter.has(descriptor.get) || isSignalGetter.has(descriptor.get))) continue

		// Handle methods (function-valued properties)
		if (typeof descriptor.value === 'function' || isAutoAccessor) {
			const fn = isAutoAccessor ? descriptor.get?.call(obj) : descriptor.value
			if (typeof fn !== 'function') continue

			const name = fn.name || String(key)
			let value

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
					set(typeof val === 'function' ? () => val : val)
				}
			}

			Object.defineProperty(value, 'name', {value: name, configurable: true})
			Object.defineProperty(obj, key, {value, configurable: true, enumerable: descriptor.enumerable})
			isMemoGetter.add(value)
		}

		// Handle accessors
		else if (descriptor.get) {
			let get
			let set: ((val: unknown) => void) | undefined

			// Readonly memo: getter only
			if (!descriptor.set) get = createMemo(() => descriptor.get!.call(obj))
			// Writable memo: getter and setter
			else [get, set] = createWritableMemo(() => descriptor.get!.call(obj))

			Object.defineProperty(get, 'name', {value: String(key), configurable: true})
			if (set) Object.defineProperty(set, 'name', {value: String(key), configurable: true})
			Object.defineProperty(obj, key, {
				get,
				set: set && (val => (typeof val === 'function' ? set(() => val) : set(val))),
				configurable: true,
				enumerable: descriptor.enumerable,
			})
			isMemoGetter.add(get)
		}

		// Skip non-function, non-accessor properties
		continue
	}

	return obj
}
