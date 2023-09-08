export function decoratorAbstraction(decorator, handlerOrProtoOrFactoryArg, propName, descriptor) {
  // This is true only if we're using the decorator in a Babel-compiled app
  // with non-legacy decorators. TypeScript only has legacy decorators.
  const isDecoratorV2 = handlerOrProtoOrFactoryArg && 'kind' in handlerOrProtoOrFactoryArg;
  if (isDecoratorV2) {
    const classElement = handlerOrProtoOrFactoryArg;
    return {
      ...classElement,
      finisher(Class) {
        decorator(Class.prototype, classElement.key);
        return classElement.finisher?.(Class) ?? Class;
      }
    };
  }
  if (handlerOrProtoOrFactoryArg && propName) {
    // if being used as a legacy decorator directly
    const prototype = handlerOrProtoOrFactoryArg;
    return decorator(prototype, propName, descriptor);
  }
  throw new TypeError('Invalid decorator');
}
//# sourceMappingURL=decoratorAbstraction.js.map