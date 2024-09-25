import { type Owner } from 'solid-js';
import type { AnyConstructor } from 'lowclass/dist/Constructor.js';
import { type Effect } from '../effects/createStoppableEffect.js';
/**
 * @class Effectful -
 *
 * `mixin`
 *
 * Create Solid.js effects using `this.createEffect(fn)` and easily stop them
 * all by calling `this.stopEffects()`.
 *
 * Example:
 *
 * ```js
 * import {reactive, signal} from 'classy-solid'
 * import {foo} from 'somewhere'
 * import {bar} from 'elsewhere'
 *
 * class MyClass extends Effectful(BaseClass) {
 *   constructor() {
 *     super()
 *
 *     // Log `foo` and `bar` any time either of them change.
 *     this.createEffect(() => {
 *       console.log('foo, bar:', foo(), bar())
 *     })
 *
 *     // Log only `bar` any time it changes.
 *     this.createEffect(() => {
 *       console.log('bar:', bar())
 *     })
 *   }
 *
 *   dispose() {
 *     // Later, stop both of the effects.
 *     this.stopEffects()
 *   }
 * }
 * ```
 */
export declare function Effectful<T extends AnyConstructor>(Base: T): {
    new (...a: any[]): {
        "__#1@#effects": Set<Effect>;
        /**
         * Create a Solid.js effect. The difference from regular
         * `createEffect()` is that `this` tracks the effects created, so that
         * they can all be stopped with `this.stopEffects()`.
         *
         * Effects can also be stopped or resumed individually:
         *
         * ```js
         * const effect1 = this.createEffect(() => {...})
         * const effect2 = this.createEffect(() => {...})
         *
         * // ...later
         * effect1.stop()
         *
         * // ...later
         * effect1.resume()
         * ```
         */
        createEffect(fn: () => void): void;
        /**
         * Stop all of the effects that were created.
         */
        stopEffects(): void;
        "__#1@#createEffect1"(fn: () => void): void;
        "__#1@#stopEffects1"(): void;
        "__#1@#owner": Owner | null;
        "__#1@#dispose": (() => void) | null;
        "__#1@#createEffect2"(fn: () => void): void;
        "__#1@#stopEffects2"(): void;
    };
} & T;
declare const Effects_base: {
    new (...a: any[]): {
        "__#1@#effects": Set<Effect>;
        /**
         * Create a Solid.js effect. The difference from regular
         * `createEffect()` is that `this` tracks the effects created, so that
         * they can all be stopped with `this.stopEffects()`.
         *
         * Effects can also be stopped or resumed individually:
         *
         * ```js
         * const effect1 = this.createEffect(() => {...})
         * const effect2 = this.createEffect(() => {...})
         *
         * // ...later
         * effect1.stop()
         *
         * // ...later
         * effect1.resume()
         * ```
         */
        createEffect(fn: () => void): void;
        /**
         * Stop all of the effects that were created.
         */
        stopEffects(): void;
        "__#1@#createEffect1"(fn: () => void): void;
        "__#1@#stopEffects1"(): void;
        "__#1@#owner": Owner | null;
        "__#1@#dispose": (() => void) | null;
        "__#1@#createEffect2"(fn: () => void): void;
        "__#1@#stopEffects2"(): void;
    };
} & {
    new (): {};
};
/**
 * Shortcut for instantiating or extending directly instead of using the mixin.
 * F.e.
 *
 * ```js
 * class Car extends Effects {
 *   start() {
 *     this.createEffect(() => {...})
 *     this.createEffect(() => {...})
 *   }
 *   stop() {
 *     this.stopEffects()
 *   }
 * }
 *
 * const specialEffects = new Effects()
 * specialEffects.createEffect(() => {})
 * // ...later
 * specialEffects.stopEffects()
 * ```
 */
export declare class Effects extends Effects_base {
}
export {};
//# sourceMappingURL=Effectful.d.ts.map