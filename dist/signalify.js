import { getInheritedDescriptor } from 'lowclass';
import { createSignal, $PROXY } from 'solid-js';
const signalifiedProps = new WeakMap();

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
  // We cast from PropertyKey[] to PropKey[] because numbers can't actually be keys, only string | symbol.
  const _props = props.length ? props : Object.keys(obj).concat(Object.getOwnPropertySymbols(obj));
  for (const prop of _props) createSignalAccessor(obj, prop);
  return obj;
}
let gotCreateSignalAccessor = false;

/**
 * This ensures that `createSignalAccessor` is kept internal to classy-solid only.
 */
export function getCreateSignalAccessor() {
  if (gotCreateSignalAccessor) throw new Error('Export "createSignalAccessor" is internal to classy-solid only.');
  gotCreateSignalAccessor = true;
  return createSignalAccessor;
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
function trackPropSetAtLeastOnce(instance, prop) {
  if (!propsSetAtLeastOnce.has(instance)) propsSetAtLeastOnce.set(instance, new Set());
  propsSetAtLeastOnce.get(instance).add(prop);
}
const isSignalGetter = new WeakSet();
function createSignalAccessor(obj, prop, initialVal = obj[prop], override = false) {
  if (!override && signalifiedProps.get(obj)?.has(prop)) return;

  // Special case for Solid proxies: if the object is already a solid proxy,
  // all properties are already reactive, no need to signalify.
  // @ts-expect-error special indexed access
  const proxy = obj[$PROXY];
  if (proxy) return;
  let descriptor = getInheritedDescriptor(obj, prop);
  let originalGet;
  let originalSet;
  if (descriptor) {
    originalGet = descriptor.get;
    originalSet = descriptor.set;

    // If we have a signal accessor, no need to create another signal accessor.
    if (originalGet && isSignalGetter.has(originalGet)) return;
    if (originalGet || originalSet) {
      // reactivity requires both
      if (!originalGet || !originalSet) {
        console.warn(`The \`@signal\` decorator was used on an accessor named "${prop.toString()}" which had a getter or a setter, but not both. Reactivity on accessors works only when accessors have both get and set. In this case the decorator does not do anything.`);
        return;
      }
      delete descriptor.get;
      delete descriptor.set;
    } else {
      // If there was a value descriptor, trust it as the source of truth
      // for initialVal. For example, if the user class modifies the value
      // after the initializer, it will have a different value than what
      // we tracked from the initializer.
      initialVal = descriptor.value;

      // if it isn't writable, we don't need to make a reactive variable because
      // the value won't change
      if (!descriptor.writable) {
        console.warn(`The \`@signal\` decorator was used on a property named "${prop.toString()}" that is not writable. Reactivity is not enabled for non-writable properties.`);
        return;
      }
      delete descriptor.value;
      delete descriptor.writable;
    }
  }
  descriptor = {
    configurable: true,
    enumerable: true,
    ...descriptor,
    get: originalGet ? function () {
      const s = getSignal(this, prop, initialVal);
      s[0](); // read
      return originalGet.call(this);
    } : function () {
      const s = getSignal(this, prop, initialVal);
      return s[0](); // read
    },

    set: originalSet ? function (newValue) {
      originalSet.call(this, newValue);
      trackPropSetAtLeastOnce(this, prop);
      const v = getSignal(this, prop);
      // write
      if (typeof newValue === 'function') v[1](() => newValue);else v[1](newValue);
    } : function (newValue) {
      trackPropSetAtLeastOnce(this, prop);
      const v = getSignal(this, prop);
      // write
      if (typeof newValue === 'function') v[1](() => newValue);else v[1](newValue);
    }
  };
  isSignalGetter.add(descriptor.get);
  Object.defineProperty(obj, prop, descriptor);
  if (!signalifiedProps.has(obj)) signalifiedProps.set(obj, new Set());
  signalifiedProps.get(obj).add(prop);
}
const signals = new WeakMap();
function getSignal(instance, signalKey, initialValue = undefined) {
  if (!signals.has(instance)) signals.set(instance, new Map());
  let s = signals.get(instance).get(signalKey);
  if (s) return s;
  s = createSignal(initialValue, {
    equals: false
  });
  signals.get(instance)?.set(signalKey, s);
  return s;
}
//# sourceMappingURL=signalify.js.map