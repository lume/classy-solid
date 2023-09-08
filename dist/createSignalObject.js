import { createSignal } from './createDeferredEffect.js';

/**
 * A signal represented as an object with .get and .set methods.
 */

/**
 * Create a Solid signal wrapped in the form of an object with `.get` and `.set`
 * methods for alternative usage patterns.
 *
 * ```js
 * let count = createSignalObject(0) // count starts at 0
 * count.set(1) // set the value of count to 1
 * count.set(count.get() + 1) // add 1
 * let currentValue = count.get() // read the current value
 * ```
 *
 * This is more convenient for class properties than using `createSignal`. With `createSignal`:
 *
 * ```js
 * class Foo {
 *   count = createSignal(0)
 *
 *   increment() {
 *     // difficult to read
 *     this.count[1](this.count[0]() + 1)
 *
 *     // also:
 *     this.count[1](c => c + 1)
 *   }
 * }
 * ```
 *
 * With `createSignalObject`:
 *
 * ```js
 * class Foo {
 *   count = createSignalObject(0)
 *
 *   increment() {
 *     // Easier to read
 *     this.count.set(this.count.get() + 1)
 *
 *     // also:
 *     this.count.set(c => c + 1)
 *   }
 * }
 * ```
 *
 * See also `createSignalFunction` for another pattern.
 */

export function createSignalObject(value, options) {
  const [get, set] = createSignal(value, options);
  return {
    get,
    set
  };
}
//# sourceMappingURL=createSignalObject.js.map