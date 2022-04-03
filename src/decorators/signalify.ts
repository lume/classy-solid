import {decoratorAbstraction} from '../decoratorAbstraction.js'
import type {AnyClassWithReactiveProps} from '../signalify.js'

/**
 * Decorate properties of a class to back them with Solid signals, making them
 * reactive. This can only be used on properties of a class that is decorated
 * with `@reactive`.
 */
export function signal(...args: any[]): any {
	return decoratorAbstraction(decorator, ...args)

	function decorator(prototype: any, propName: string, _descriptor?: PropertyDescriptor) {
		const Class = prototype?.constructor as AnyClassWithReactiveProps | undefined

		if (!Class)
			throw new TypeError('Invalid use of @signal decorator, or use with new decorator spec not yet supported.')

		trackReactiveProperty(Class, propName)
	}
}

function trackReactiveProperty(Class: AnyClassWithReactiveProps, propName: string) {
	// Use this one because the @reactive decorator handles signalProperties
	// along the whole hierarchy, rather than once at the submost class.
	if (!Class.signalProperties || !Class.hasOwnProperty('signalProperties')) Class.signalProperties = []
	if (!Class.signalProperties.includes(propName)) Class.signalProperties.push(propName)

	// Use this one if there's a way to handle signalProperties at the submost class?
	// if (!Class.hasOwnProperty('receivedProperties')) Class.signalProperties = [...(Class.signalProperties || [])]
	// if (!Class.signalProperties!.includes(propName)) Class.signalProperties!.push(propName)
}
