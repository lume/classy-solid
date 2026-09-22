import { type Owner, type Accessor, type Setter, type MemoOptions } from 'solid-js';
import type { AnyConstructor } from 'lowclass/dist/Constructor.js';
import { type LazyMemoOptions } from '../signals/createLazyMemo.js';
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
 *
 * Memos are managed the same way. `this.createMemo(fn)` returns a lazy memo
 * accessor owned by this instance's root, so `this.stopEffects()` disposes it
 * along with the effects and `this.startEffects()` brings it back (dependents
 * re-run and lazily recreate it). The `@memo` decorator uses this under the
 * hood. Like `createEffect()`, calling `createMemo()` from inside one of this
 * instance's own effects instead creates a memo owned by that effect.
 */
export declare function Effectful<T extends AnyConstructor>(Base: T): {
    new (...a: any[]): {
        "__#1@#effectFunctions": Array<() => void>;
        "__#1@#started": boolean;
        /**
         * Create a Solid.js effect. The difference from regular
         * `createEffect()` is that `this` tracks the effects created, so that
         * they can all be stopped with `this.stopEffects()`.
         *
         * Note, if effects are stopped, this starts them again, before
         * creating the new effect. All effects are always all started, or all
         * stopped.
         */
        createEffect(fn: () => void): void;
        /**
         * Adds an effect function to the list of tracked effects without
         * starting it. This is useful for adding an effect, then using
         * `startEffects()` later to start all effects at once.
         *
         * The `@effect` decorator uses this internally when its `autoStart`
         * option is set to `false`.
         */
        addEffectFn(fn: () => void): void;
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
        "__#1@#parentOwner": Owner | null;
        "__#1@#dispose": () => void;
        "__#1@#owner": Owner;
        "__#1@#createEffect"(fn: () => void): void;
        /**
         * One restart signal per instance. Every Effectful-owned memo accessor
         * reads it, so bumping it once in `startEffects()` re-runs every
         * dependent of every memo, which then lazily recreates the memos.
         */
        "__#1@#memoVersion": import("solid-js").Signal<number>;
        /**
         * Create a lazy Solid.js memo whose lifecycle is managed by this
         * instance, like `createEffect()` manages effects. Same `(fn, value,
         * options)` shape as Solid's `createMemo`.
         *
         * The memo's computation does not run until the returned accessor is
         * first read. The owner is decided by where `createMemo()` is
         * *called*, following the same rules as `createEffect()`:
         *
         * - Called in the constructor, or in the same scope that instantiated
         *   the object, or with no reactive owner: the memo is owned by this
         *   instance's root, alongside its effects. `stopEffects()` disposes
         *   it, and `startEffects()` notifies its dependents so they re-read
         *   and recreate it. The returned accessor stays the same across
         *   stop/start.
         * - Called inside one of this instance's own effects: the memo is a
         *   lazy memo owned by that effect (standard Solid semantics; disposed
         *   and recreated when that effect re-runs).
         *
         * While effects are stopped, reading the accessor computes `fn`
         * directly (like a plain getter) without creating anything.
         */
        createMemo<T_1>(fn: (prev: T_1 | undefined) => T_1, value?: T_1, options?: MemoOptions<T_1>): Accessor<T_1>;
        /**
         * Like `createMemo()`, but returns `[get, set]` where `set` overrides
         * the memo's value until a dependency next changes (backed by
         * `createWritableMemo` from `@solid-primitives/memo`). Writing while
         * effects are stopped throws.
         */
        createWritableMemo<T_1>(fn: (prev: T_1 | undefined) => T_1, value?: T_1, options?: MemoOptions<T_1>): [get: Accessor<T_1>, set: Setter<T_1>];
        "__#1@#memo"<T_1>(fn: (prev: T_1 | undefined) => T_1, value: T_1 | undefined, options: LazyMemoOptions<T_1>): readonly [get: Accessor<T_1>, set?: Setter<T_1>];
        "__#1@#lazyMemo"<T_1>(fn: (prev: T_1 | undefined) => T_1, value: T_1 | undefined, options: LazyMemoOptions<T_1>): readonly [get: Accessor<T_1>, set?: Setter<T_1>];
    };
} & T;
export type AnyEffectful = InstanceType<ReturnType<typeof Effectful>>;
export declare function isAnyEffectful(o: any): o is AnyEffectful;
declare const Effects_base: {
    new (...a: any[]): {
        "__#1@#effectFunctions": (() => void)[];
        "__#1@#started": boolean;
        /**
         * Create a Solid.js effect. The difference from regular
         * `createEffect()` is that `this` tracks the effects created, so that
         * they can all be stopped with `this.stopEffects()`.
         *
         * Note, if effects are stopped, this starts them again, before
         * creating the new effect. All effects are always all started, or all
         * stopped.
         */
        createEffect(fn: () => void): void;
        /**
         * Adds an effect function to the list of tracked effects without
         * starting it. This is useful for adding an effect, then using
         * `startEffects()` later to start all effects at once.
         *
         * The `@effect` decorator uses this internally when its `autoStart`
         * option is set to `false`.
         */
        addEffectFn(fn: () => void): void;
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
        "__#1@#parentOwner": Owner | null;
        "__#1@#dispose": () => void;
        "__#1@#owner": Owner;
        "__#1@#createEffect"(fn: () => void): void;
        /**
         * One restart signal per instance. Every Effectful-owned memo accessor
         * reads it, so bumping it once in `startEffects()` re-runs every
         * dependent of every memo, which then lazily recreates the memos.
         */
        "__#1@#memoVersion": import("solid-js").Signal<number>;
        /**
         * Create a lazy Solid.js memo whose lifecycle is managed by this
         * instance, like `createEffect()` manages effects. Same `(fn, value,
         * options)` shape as Solid's `createMemo`.
         *
         * The memo's computation does not run until the returned accessor is
         * first read. The owner is decided by where `createMemo()` is
         * *called*, following the same rules as `createEffect()`:
         *
         * - Called in the constructor, or in the same scope that instantiated
         *   the object, or with no reactive owner: the memo is owned by this
         *   instance's root, alongside its effects. `stopEffects()` disposes
         *   it, and `startEffects()` notifies its dependents so they re-read
         *   and recreate it. The returned accessor stays the same across
         *   stop/start.
         * - Called inside one of this instance's own effects: the memo is a
         *   lazy memo owned by that effect (standard Solid semantics; disposed
         *   and recreated when that effect re-runs).
         *
         * While effects are stopped, reading the accessor computes `fn`
         * directly (like a plain getter) without creating anything.
         */
        createMemo<T>(fn: (prev: T | undefined) => T, value?: T | undefined, options?: MemoOptions<T> | undefined): Accessor<T>;
        /**
         * Like `createMemo()`, but returns `[get, set]` where `set` overrides
         * the memo's value until a dependency next changes (backed by
         * `createWritableMemo` from `@solid-primitives/memo`). Writing while
         * effects are stopped throws.
         */
        createWritableMemo<T>(fn: (prev: T | undefined) => T, value?: T | undefined, options?: MemoOptions<T> | undefined): [get: Accessor<T>, set: Setter<T>];
        "__#1@#memo"<T>(fn: (prev: T | undefined) => T, value: T | undefined, options: LazyMemoOptions<T>): readonly [get: Accessor<T>, set?: Setter<T> | undefined];
        "__#1@#lazyMemo"<T>(fn: (prev: T | undefined) => T, value: T | undefined, options: LazyMemoOptions<T>): readonly [get: Accessor<T>, set?: Setter<T> | undefined];
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