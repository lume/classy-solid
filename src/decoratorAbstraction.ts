import type {Constructor} from 'lowclass'

export function decoratorAbstraction(
	decorator: (prototype: any, propName: string, _descriptor?: PropertyDescriptor) => void,
	handlerOrProtoOrFactoryArg?: any,
	propName?: string,
	descriptor?: PropertyDescriptor,
) {
	// This is true only if we're using the decorator in a Babel-compiled app
	// with non-legacy decorators. TypeScript only has legacy decorators.
	const isDecoratorV2 = handlerOrProtoOrFactoryArg && 'kind' in handlerOrProtoOrFactoryArg

	if (isDecoratorV2) {
		const classElement = handlerOrProtoOrFactoryArg

		return {
			...classElement,
			finisher(Class: Constructor) {
				decorator(Class.prototype, classElement.key)
				return classElement.finisher?.(Class) ?? Class
			},
		}
	}

	if (handlerOrProtoOrFactoryArg && propName) {
		// if being used as a legacy decorator directly
		const prototype = handlerOrProtoOrFactoryArg
		return decorator(prototype, propName, descriptor)
	}

	throw new TypeError('Invalid decorator')
}
