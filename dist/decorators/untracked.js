import { getListener, untrack } from 'solid-js';

/**
 * A decorator that makes a class's contructor untracked.
 *
 * Sometimes, not typically, you may want to ensure that when a class is
 * instantiated, any signal reads that happen during the constructor do not
 * track those reads.
 *
 * Normally you do not need to read signals during construction, but if you do,
 * you should use `@untracked` to avoid accidentally creating dependencies on
 * those signals for any effects that instantiate the class (therefore avoiding
 * infinite loops).
 *
 * Example:
 *
 * ```ts
 * import {untracked, signal} from "classy-solid";
 * import {createEffect} from "solid-js";
 *
 * ⁣@untracked
 * class Example {
 *   ⁣@signal count = 0;
 *
 *   constructor() {
 *     this.count = this.count + 1; // does not track .count signal read in any outer effect.
 *   }
 * }
 *
 * createEffect(() => {
 *   // This does not track .count, so this effect will not re-run when .count changes.
 *   // If this did track .count, an infinite loop would happen.
 *   const example = new Example();
 *
 *   createEffect(() => {
 *     // This inner effect tracks .count, so it will re-run (independent of the
 *     // outer effect) when .count changes.
 *     console.log(example.count);
 *   });
 * });
 * ```
 *
 * This can also be called manually without decorators:
 *
 * ```ts
 * import {untracked} from "classy-solid";
 *
 * const Example = untracked(
 *   class {
 *     count = 0;
 *
 *     constructor() {
 *       this.count = this.count + 1; // does not track .count signal read in any outer effect.
 *     }
 *   }
 * )
 *
 * // ...same usage as above...
 * ```
 */
export function untracked(value, context) {
  // context may be undefined when unsing untracked() without decorators
  if (typeof value !== 'function' || context && context.kind !== 'class') throw new TypeError('The @untracked decorator is only for use on classes.');
  const Class = value;
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
      return instance;
    }
  }
  return ReactiveDecorator;
}
//# sourceMappingURL=untracked.js.map