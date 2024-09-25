// FIXME Solid 1.7.9+ requires a TypeScript update, so classy-solid code is made
// un-typesafe until we update.

// import {createSignal} from './createDeferredEffect.js'
import { createSignal } from 'solid-js';

/**
 * A single function that with no args passed reads a signal, otherwise sets a
 * signal just like a Setter does.
 */
// FIXME broke in 1.7.9

/**
 * Create a Solid signal wrapped as a single function that gets the value when
 * no arguments are passed in, and sets the value when an argument is passed in.
 * Good for alternative usage patterns, such as when read/write segregation is
 * not needed.
 *
 * ```js
 * let count = createSignalFunction(0) // create it with default value
 * count(1) // set the value
 * count(count() + 1) // increment
 * let currentValue = count() // read the current value
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
 * With `createSignalFunction`:
 *
 * ```js
 * class Foo {
 *   count = createSignalFunction(0)
 *
 *   increment() {
 *     // Easier to read
 *     this.count(this.count() + 1)
 *
 *     // also:
 *     this.count(c => c + 1)
 *   }
 * }
 * ```
 *
 * See also `createSignalObject` for another pattern.
 */

export function createSignalFunction(value, options) {
  const [get, set] = createSignal(value, options);
  return function (value) {
    if (arguments.length === 0) return get();
    return set(
    // @ts-ignore FIXME its ok, value is defined (even if `undefined`)
    value);
  };
}
//# sourceMappingURL=createSignalFunction.js.map