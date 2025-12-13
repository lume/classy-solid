import { createEffect, createRoot, getOwner, runWithOwner } from 'solid-js';
const isInstance = Symbol();

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
export function Effectful(Base) {
  if (Base.prototype instanceof Effectful) throw new Error('Class already extends Effectful, no need to apply the mixin again.');
  class EffectfulClass extends Base {
    #effectFunctions = [];
    #started = true;

    /**
     * Create a Solid.js effect. The difference from regular
     * `createEffect()` is that `this` tracks the effects created, so that
     * they can all be stopped with `this.stopEffects()`.
     */
    createEffect(fn) {
      this.startEffects();
      this.#createEffect(fn);
    }
    #isRestarting = false;

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
    startEffects() {
      if (this.#started) return;
      this.#started = true;

      // Restart all stored effect functions
      this.#isRestarting = true;
      try {
        for (const fn of this.#effectFunctions) this.#createEffect(fn);
      } finally {
        this.#isRestarting = false;
      }
    }

    /**
     * Stop all of the effects that were created.
     */
    stopEffects() {
      if (!this.#started) return;
      this.#started = false;
      this.#dispose?.();
    }

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
    clearEffects() {
      this.stopEffects();
      this.#effectFunctions = [];
    }
    #owner = null;
    #dispose = null;
    #createEffect(fn) {
      const owner = getOwner();

      // If nested in an existing owner (f.e. nested effect), delegate to
      // regular createEffect.
      if (owner) return createEffect(fn);

      // Store top-level effect functions so they can be replayed when
      // startEffects() is called
      if (!this.#isRestarting) this.#effectFunctions.push(fn);

      // If top-level call either attach to an existing root, or make a
      // new one if we don't have one yet.
      if (this.#owner) runWithOwner(this.#owner, () => createEffect(fn));else {
        createRoot(dispose => {
          this.#owner = getOwner();
          this.#dispose = () => {
            dispose();
            this.#owner = null;
          };
          createEffect(fn);
        });
      }
    }
  }
  ;
  EffectfulClass.prototype[isInstance] = true;
  Object.defineProperty(EffectfulClass, Symbol.hasInstance, {
    value: instanceCheck
  });
  return EffectfulClass;
}
Object.defineProperty(Effectful, Symbol.hasInstance, {
  value: instanceCheck
});
function instanceCheck(obj) {
  if (!obj || typeof obj !== 'object') return false;
  return isInstance in obj;
}

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
export class Effects extends Effectful(class {}) {}
//# sourceMappingURL=Effectful.js.map