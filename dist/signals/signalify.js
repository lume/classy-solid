import { getInheritedDescriptor } from 'lowclass/dist/getInheritedDescriptor.js';
import { $PROXY, untrack } from 'solid-js';
import { createSignalFunction } from './createSignalFunction.js';

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

export function signalify(obj, ...props) {
  // Special case for Solid proxies: if the object is already a solid proxy,
  // all properties are already reactive, no need to signalify.
  // @ts-expect-error special indexed access
  const proxy = obj[$PROXY];
  if (proxy) return obj;
  const _props = props.length ? props : Object.keys(obj).concat(Object.getOwnPropertySymbols(obj));

  // Use `untrack` here to be extra safe the initial value doesn't count as a
  // dependency and cause a reactivity loop.
  for (const prop of _props) {
    const isTuple = Array.isArray(prop);
    // We cast from PropertyKey to PropKey because keys can't actually be number, only string | symbol.
    const _prop = isTuple ? prop[0] : prop;
    const initialValue = isTuple ? prop[1] : untrack(() => obj[_prop]);
    __createSignalAccessor(obj, _prop, initialValue);
  }
  return obj;
}

// propsSetAtLeastOnce is a Set that tracks which reactive properties have been
// set at least once.
const propsSetAtLeastOnce = new WeakMap();

// @lume/element uses this to detect if a reactive prop has been set, and if so
// will not overwrite the value with any pre-existing value from custom element
// pre-upgrade.
export function __isPropSetAtLeastOnce(instance, prop) {
  return !!propsSetAtLeastOnce.get(instance)?.has(prop);
}
export function __trackPropSetAtLeastOnce(instance, prop) {
  if (!propsSetAtLeastOnce.has(instance)) propsSetAtLeastOnce.set(instance, new Set());
  propsSetAtLeastOnce.get(instance).add(prop);
}
export const isSignalGetter = new WeakSet();
export function __createSignalAccessor(obj, prop, initialVal) {
  let descriptor = getInheritedDescriptor(obj, prop);
  let originalGet;
  let originalSet;
  const isAccessor = !!(descriptor?.get || descriptor?.set);
  if (descriptor) {
    originalGet = descriptor.get;
    originalSet = descriptor.set;
    if (originalGet && isSignalGetter.has(originalGet)) return;
    // reactivity requires both
    if (isAccessor && !(originalGet && originalSet)) return warnNotReadWrite(prop);
    if (!isAccessor) {
      // no need to make a signal that can't be written to
      if (!descriptor.writable) return warnNotWritable(prop);

      // If there was a value descriptor, trust it as the source of truth
      // for initialVal. For example, if the user class modifies the value
      // after the initializer, it will have a different value than what
      // we tracked from the initializer.
      initialVal = descriptor.value;
    }
  }
  const signalStorage = new WeakMap();
  const newDescriptor = {
    configurable: true,
    enumerable: descriptor?.enumerable,
    get: isAccessor ? function () {
      __getSignal(this, signalStorage, initialVal)();
      return originalGet.call(this);
    } : function () {
      return __getSignal(this, signalStorage, initialVal)();
    },
    set: isAccessor ? function (newValue) {
      originalSet.call(this, newValue);
      __trackPropSetAtLeastOnce(this, prop);
      const s = __getSignal(this, signalStorage, initialVal);
      s(typeof newValue === 'function' ? () => newValue : newValue);
    } : function (newValue) {
      __trackPropSetAtLeastOnce(this, prop);
      const s = __getSignal(this, signalStorage, initialVal);
      s(typeof newValue === 'function' ? () => newValue : newValue);
    }
  };
  isSignalGetter.add(newDescriptor.get);
  Object.defineProperty(obj, prop, newDescriptor);
}
export function __getSignal(obj, storage, initialVal) {
  let s = storage.get(obj);
  if (!s) storage.set(obj, s = createSignalFunction(initialVal, {
    equals: false
  }));
  return s;
}
function warnNotReadWrite(prop) {
  console.warn(`Cannot signalify property named "${String(prop)}" which had a getter or a setter, but not both. Reactivity on accessors works only when accessors have both get and set. Skipped.`);
}
function warnNotWritable(prop) {
  console.warn(`The \`@signal\` decorator was used on a property named "${String(prop)}" that is not writable. Reactivity is not enabled for non-writable properties.`);
}
//# sourceMappingURL=signalify.js.map