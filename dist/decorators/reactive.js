import { getListener, $PROXY, untrack } from 'solid-js';
import { __propsToSignalify, __resetPropsToSignalify } from './signal.js';
import { __createSignalAccessor } from '../signals/signalify.js';
const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * A decorator that makes a class reactive, allowing it have properties
 * decorated with `@signal` to make those properties reactive Solid signals.
 *
 * Example:
 *
 * ```js
 * import {reactive, signal} from 'classy-solid'
 * import {createEffect} from 'solid-js'
 *
 * ⁣@reactive
 * class Counter {
 *   ⁣@signal count = 0
 *
 *   constructor() {
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
 */
export function reactive(value, context) {
  // context may be undefined when unsing reactive() without decorators
  if (typeof value !== 'function' || context && context.kind !== 'class') throw new TypeError('The @reactive decorator is only for use on classes.');
  const Class = value;

  // For the current class decorated with @reactive, we reset the map, so that
  // for the next class decorated with @reactive we track only that next
  // class's properties that were decorated with @signal. We do this because
  // field decorators do not have access to the class or its prototype.
  //
  // In the future maybe we can use decorator metadata for this
  // (https://github.com/tc39/proposal-decorator-metadata)?
  const signalProps = __propsToSignalify; // grab the current value before we reset it.
  __resetPropsToSignalify();
  class ReactiveDecorator extends Class {
    constructor(...args) {
      let instance;

      // Ensure that if we're in an effect that `new`ing a class does not
      // track signal reads, otherwise we'll get into an infinite loop. If
      // someone want to trigger an effect based on properties of the
      // `new`ed instance, they can explicitly read the properties
      // themselves in the effect, making their intent clear.
      if (getListener()) untrack(() => instance = Reflect.construct(Class, args, new.target)); // super()
      else super(...args), instance = this;

      // Special case for Solid proxies: if the object is already a solid proxy,
      // all properties are already reactive, no need to signalify.
      // @ts-expect-error special indexed access
      const proxy = instance[$PROXY];
      if (proxy) return instance;
      for (const [prop, propSpec] of signalProps) {
        let initialValue = propSpec.initialValue;

        // @prod-prune
        if (!(hasOwnProperty.call(instance, prop) || hasOwnProperty.call(Class.prototype, prop))) throw new PropNotFoundError(prop);
        __createSignalAccessor(instance, prop, initialValue);
      }
      return instance;
    }
  }
  return ReactiveDecorator;
}
class PropNotFoundError extends Error {
  constructor(prop) {
    super(`Property "${String(prop)}" not found on instance of class decorated with \`@reactive\`. Did you forget to use the \`@reactive\` decorator on one of your classes that has a "${String(prop)}" property decorated with \`@signal\`?`);
  }
}
//# sourceMappingURL=reactive.js.map