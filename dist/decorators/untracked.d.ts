import type { AnyConstructor } from 'lowclass/dist/Constructor.js';
import './metadata-shim.js';
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
export declare function untracked(value: AnyConstructor, context: ClassDecoratorContext | undefined): any;
//# sourceMappingURL=untracked.d.ts.map