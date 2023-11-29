import { type Owner } from 'solid-js';
import type { AnyConstructor } from 'lowclass';
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
 * import {element, Effectful} from 'lume'
 *
 * ⁣@element('my-element')
 * class MyElement extends Effectful(HTMLElement) {
 *   ⁣@attribute foo = "foo"
 *   ⁣@attribute bar = "bar"
 *
 *   connectedCallback() {
 *     // Log `foo` and `bar` any time either of them change.
 *     this.createEffect(() => {
 *       console.log('foo, bar:', this.foo, this.bar)
 *     })
 *
 *     // Log only `bar` any time it changes.
 *     this.createEffect(() => {
 *       console.log('bar:', this.bar)
 *     })
 *   }
 *
 *   disconnectedCallback() {
 *     // Stop both of the effects.
 *     this.stopEffects()
 *   }
 * }
 * ```
 */
export declare function Effectful<T extends AnyConstructor>(Base: T): {
    new (...a: any[]): {
        "__#1@#owner": Owner | null;
        "__#1@#dispose": StopFunction | null;
        /**
         * Create a Solid.js effect. If there's no owner (i.e. this will be a
         * top-level effect) then it implicitly creates an owner. Normally with
         * Solid.js you must use createRoot with top-level effects, and this
         * prevents that for convenience.
         */
        createEffect(fn: () => void): void;
        /**
         * Stop all of the effects that were created. For example, create
         * effects in a constructor, then stop them all in a destructor, to
         * avoid mem leaks.
         */
        stopEffects(): void;
    };
} & T;
declare const Effects_base: {
    new (...a: any[]): {
        "__#1@#owner": Owner | null;
        "__#1@#dispose": StopFunction | null;
        /**
         * Create a Solid.js effect. If there's no owner (i.e. this will be a
         * top-level effect) then it implicitly creates an owner. Normally with
         * Solid.js you must use createRoot with top-level effects, and this
         * prevents that for convenience.
         */
        createEffect(fn: () => void): void;
        /**
         * Stop all of the effects that were created. For example, create
         * effects in a constructor, then stop them all in a destructor, to
         * avoid mem leaks.
         */
        stopEffects(): void;
    };
} & ObjectConstructor;
/**
 * Shortcut for instantiating directly instead of using the mixin.
 */
export declare class Effects extends Effects_base {
}
type StopFunction = () => void;
export {};
//# sourceMappingURL=Effectful.d.ts.map