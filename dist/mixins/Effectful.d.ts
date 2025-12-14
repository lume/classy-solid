import { type Owner } from 'solid-js';
import type { AnyConstructor } from 'lowclass/dist/Constructor.js';
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
 * import {signal} from 'classy-solid'
 * import {foo} from 'somewhere'
 * import {BaseClass} from 'some-lib'
 *
 * class MyClass extends Effectful(BaseClass) {
 *   @signal bar = 0
 *
 *   constructor() {
 *     super()
 *
 *     // Log `foo` and `bar` any time either of them change.
 *     this.createEffect(() => {
 *       console.log('foo, bar:', foo(), this.bar)
 *     })
 *
 *     // Log only `bar` any time it changes.
 *     this.createEffect(() => {
 *       console.log('bar:', this.bar)
 *     })
 *   }
 *
 *   dispose() {
 *     // Later, stop both of the effects.
 *     this.stopEffects()
 *   }
 * }
 * ```
 *
 * This pairs nicely with the `@effect` decorator. The previous example could be
 * rewritten as:
 *
 * ```js
 * import {signal, effect} from 'classy-solid'
 * import {foo} from 'somewhere'
 * import {BaseClass} from 'some-lib'
 *
 * class MyClass extends Effectful(BaseClass) {
 *   @signal bar = 0
 *
 *   @effect logFooBar() {
 *     console.log('foo, bar:', foo(), this.bar)
 *   }
 *
 *   @effect logBar() {
 *     console.log('bar:', this.bar)
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
        "__#1@#effectFunctions": Array<() => void>;
        "__#1@#started": boolean;
        /**
         * Create a Solid.js effect. The difference from regular
         * `createEffect()` is that `this` tracks the effects created, so that
         * they can all be stopped with `this.stopEffects()`.
         */
        createEffect(fn: () => void): void;
        "__#1@#isRestarting": boolean;
        /**
         * Start all effects again. This will recreate all effects that were
         * previously created with `createEffect()` and stopped with `stopEffects()`.
         *
         * Example with a custom element class using the @effect decorator:
         *
         * ```ts
         * const [someSignal, setSomeSignal] = createSignal(0)
         *
         * class MyElement extends Effectful(HTMLElement) {
         *   @effect logSignal() {
         *     console.log('someSignal:', someSignal())
         *   }
         *
         *   connectedCallback() {
         *     this.startEffects()
         *   }
         *
         *   disconnectedCallback() {
         *     this.stopEffects()
         *   }
         * }
         * ```
         *
         * The logging of `someSignal` will happen any time `someSignal` changes
         * only while the element is connected, and but not when it is
         * disconnected.
         */
        startEffects(): void;
        /**
         * Stop all of the effects that were created.
         */
        stopEffects(): void;
        /**
         * Stop all effects and clear the stored effect functions. After calling
         * this, `startEffects()` will not restart any effects because there are
         * none stored. This is useful for cleanup scenarios where you'll make
         * new effects using `this.createEffect()` instead of restarting old
         * ones, namely for backwards compatibility for example with custom
         * elements that may be disconnected and reconnected to the DOM and
         * currently call `this.createEffect()` in connectedCallback. Example:
         *
         * ```ts
         * class MyElement extends Effectful(HTMLElement) {
         *   connectedCallback() {
         *     // Create any number of effects on connect.
         *     this.createEffect(() => {...})
         *     this.createEffect(() => {...})
         *     this.createEffect(() => {...})
         *   }
         *
         *   disconnectedCallback() {
         *     // Clean up all effects on disconnect.
         *     this.clearEffects()
         *   }
         * }
         * ```
         */
        clearEffects(): void;
        "__#1@#owner": Owner | null;
        "__#1@#dispose": (() => void) | null;
        "__#1@#createEffect"(fn: () => void): void;
    };
} & T;
declare const Effects_base: {
    new (...a: any[]): {
        "__#1@#effectFunctions": (() => void)[];
        "__#1@#started": boolean;
        /**
         * Create a Solid.js effect. The difference from regular
         * `createEffect()` is that `this` tracks the effects created, so that
         * they can all be stopped with `this.stopEffects()`.
         */
        createEffect(fn: () => void): void;
        "__#1@#isRestarting": boolean;
        /**
         * Start all effects again. This will recreate all effects that were
         * previously created with `createEffect()` and stopped with `stopEffects()`.
         *
         * Example with a custom element class using the @effect decorator:
         *
         * ```ts
         * const [someSignal, setSomeSignal] = createSignal(0)
         *
         * class MyElement extends Effectful(HTMLElement) {
         *   @effect logSignal() {
         *     console.log('someSignal:', someSignal())
         *   }
         *
         *   connectedCallback() {
         *     this.startEffects()
         *   }
         *
         *   disconnectedCallback() {
         *     this.stopEffects()
         *   }
         * }
         * ```
         *
         * The logging of `someSignal` will happen any time `someSignal` changes
         * only while the element is connected, and but not when it is
         * disconnected.
         */
        startEffects(): void;
        /**
         * Stop all of the effects that were created.
         */
        stopEffects(): void;
        /**
         * Stop all effects and clear the stored effect functions. After calling
         * this, `startEffects()` will not restart any effects because there are
         * none stored. This is useful for cleanup scenarios where you'll make
         * new effects using `this.createEffect()` instead of restarting old
         * ones, namely for backwards compatibility for example with custom
         * elements that may be disconnected and reconnected to the DOM and
         * currently call `this.createEffect()` in connectedCallback. Example:
         *
         * ```ts
         * class MyElement extends Effectful(HTMLElement) {
         *   connectedCallback() {
         *     // Create any number of effects on connect.
         *     this.createEffect(() => {...})
         *     this.createEffect(() => {...})
         *     this.createEffect(() => {...})
         *   }
         *
         *   disconnectedCallback() {
         *     // Clean up all effects on disconnect.
         *     this.clearEffects()
         *   }
         * }
         * ```
         */
        clearEffects(): void;
        "__#1@#owner": Owner | null;
        "__#1@#dispose": (() => void) | null;
        "__#1@#createEffect"(fn: () => void): void;
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