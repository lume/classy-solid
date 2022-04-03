import {getInheritedDescriptor} from 'lowclass'
import {createSignal} from './createDeferredEffect.js'
import type {Signal} from 'solid-js/types/reactive/signal'

/**
 * Convert properties on an object into Solid signal-backed properties.
 *
 * There are two ways to use this: either by defining which properties to
 * convert to signal-backed properties by providing an array as property names
 * in the second arg, which is useful on plain objects, or by passing in `this`
 * and `this.constructor` within the `constructor` of a class that has
 * properties decorated with `@signal`.
 */
export function signalify<T extends object>(obj: T, props?: (keyof T)[]): typeof obj
export function signalify<C extends AnyClass>(obj: InstanceType<C>, ctor: C): typeof obj
export function signalify(obj: Obj, propsOrClass: PropertyKey[] | AnyClassWithReactiveProps | undefined) {
	if (isClass(propsOrClass)) {
		const Class = propsOrClass
		const props = Class.signalProperties
		if (Array.isArray(props)) createSignalAccessors(obj, props)
	} else {
		const props = propsOrClass ?? Object.keys(obj)
		createSignalAccessors(obj, props)
	}

	return obj
}

function isClass(obj: unknown): obj is AnyClass {
	return typeof obj == 'function'
}

// Defines a reactive accessor on obj.
function createSignalAccessors<T extends ObjWithReactifiedProps>(obj: T, props: (keyof T)[]) {
	for (const prop of props) {
		if (obj.__reactifiedProps__?.has(prop)) continue

		const initialValue = obj[prop]
		createSignalAccessor(obj, prop)
		obj[prop] = initialValue
	}
}

function createSignalAccessor<T extends ObjWithReactifiedProps>(obj: T, propName: keyof T): void {
	const vName = 'v_' + propName

	// XXX If obj already has vName, skip making an accessor? I think perhaps
	// not, because a subclass might override a property so it is not reactive,
	// and a further subclass might want to make it reactive again in which
	// case returning early would cause the subclass subclass's property not to
	// be reactive.
	// if (obj[vName] !== undefined) return

	let descriptor: PropertyDescriptor | undefined = getInheritedDescriptor(obj, propName)

	let originalGet: (() => any) | undefined
	let originalSet: ((v: any) => void) | undefined
	let initialValue: unknown

	// TODO if there is an inherited accessor, we need to ensure we still call
	// it so that we're extending instead of overriding. Otherwise placing
	// @reactive on a property will break that functionality in those cases.
	//
	// Right now, originalGet will only be called if it is on the current
	// prototype, but we aren't checking for any accessor that may be inherited.

	if (descriptor) {
		originalGet = descriptor.get
		originalSet = descriptor.set

		if (originalGet || originalSet) {
			// reactivity requires both
			if (!originalGet || !originalSet) {
				console.warn(
					'The `@reactive` decorator was used on an accessor named "' +
						propName +
						'" which had a getter or a setter, but not both. Reactivity on accessors works only when accessors have both get and set. In this case the decorator does not do anything.',
				)
				return
			}

			delete descriptor.get
			delete descriptor.set
		} else {
			initialValue = descriptor.value

			// if it isn't writable, we don't need to make a reactive variable because
			// the value won't change
			if (!descriptor.writable) {
				console.warn(
					'The `@reactive` decorator was used on a property named ' +
						propName +
						' that is not writable. Reactivity is not enabled for non-writable properties.',
				)
				return
			}

			delete descriptor.value
			delete descriptor.writable
		}
	}

	descriptor = {
		configurable: true,
		enumerable: true,
		...descriptor,
		get: originalGet
			? function (this: any): unknown {
					// track reactivity, but get the value from the original getter

					// XXX this causes initialValue to be held onto even if the original
					// prototype value has changed. In pratice the original prototype
					// values usually never change, and these days people don't normally
					// use prototype values to begin with.
					const s = getReactiveVar(this, vName, initialValue)
					s[0]() // read

					return originalGet!.call(this)
			  }
			: function (this: any): unknown {
					// TODO don't read directly, to avoid the batch problem. https://github.com/solidjs/solid/issues/879
					const s = getReactiveVar(this, vName, initialValue)
					return s[0]() // read
			  },
		set: originalSet
			? function (this: any, newValue: unknown) {
					originalSet!.call(this, newValue)

					const v = getReactiveVar(this, vName)
					v[1](newValue) // write

					// __propsSetAtLeastOnce__ is a Set that tracks which reactive
					// properties have been set at least once. @lume/element uses this
					// to detect if a reactive prop has been set, and if so will not
					// overwrite the value with any value from custom element
					// pre-upgrade.
					if (!this.__propsSetAtLeastOnce__) this.__propsSetAtLeastOnce__ = new Set<string>()
					this.__propsSetAtLeastOnce__.add(propName)
			  }
			: function (this: any, newValue: unknown) {
					const v = getReactiveVar(this, vName)
					v[1](newValue) // write

					if (!this.__propsSetAtLeastOnce__) this.__propsSetAtLeastOnce__ = new Set<string>()
					this.__propsSetAtLeastOnce__.add(propName)
			  },
	}

	if (!obj.__reactifiedProps__) obj.__reactifiedProps__ = new Set()
	obj.__reactifiedProps__.add(propName)

	Object.defineProperty(obj, propName, descriptor)
}

function getReactiveVar<T>(instance: Obj<Signal<T>>, sName: string, initialValue: T = undefined!): Signal<T> {
	// NOTE alternatively, we could use a WeakMap instead of exposing the
	// variable on the instance. We could also use Symbols keys for
	// semi-privacy.
	let v: Signal<T> = instance[sName]

	if (v) return v

	instance[sName] = v = createSignal<T>(initialValue)

	return v
}

type AnyClass = new (...args: any[]) => object
export type AnyClassWithReactiveProps = (new (...args: any[]) => object) & {
	signalProperties?: string[]
	__isReactive__?: true
}

type Obj<T = unknown> = Record<PropertyKey, T> & {constructor: AnyClass}
type ObjWithReactifiedProps<T = unknown> = Obj<T> & {__reactifiedProps__?: Set<PropertyKey>}
