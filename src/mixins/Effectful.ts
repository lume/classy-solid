import {type Owner, createEffect, onCleanup, createRoot, getOwner, runWithOwner} from 'solid-js'
import type {AnyConstructor} from 'lowclass/dist/Constructor.js'
import {createStoppableEffect, type Effect} from '../effects/createStoppableEffect.js'

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
export function Effectful<T extends AnyConstructor>(Base: T) {
	return class Effectful extends Base {
		#effects = new Set<Effect>()

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
		createEffect(fn: () => void) {
			let method = 4
			if (method === 1) this.#createEffect1(fn) // not working, bugs out when inside a Solid render() root, effects stop re-running. https://discord.com/channels/722131463138705510/751355413701591120/1188246668466991134
			if (method === 2) createRoot(() => this.#createEffect1(fn)) // works without nesting, but leaks stopped effects until the parent owner is cleaned up (will never clean up if the parent is running for lifetime of the app).
			if (method === 3) queueMicrotask(() => this.#createEffect1(fn)) // works without nesting, without leaks
			if (method === 4) this.#createEffect2(fn) // works with nesting, without leaks
		}

		/**
		 * Stop all of the effects that were created.
		 */
		stopEffects() {
			let method = 2
			if (method === 1) this.#stopEffects1()
			if (method === 2) this.#stopEffects2()
		}

		// Method 1 //////////////////////////////////////////
		// Works fine when not in a parent context, or else currently leaks or has the above mentioned bug while a parent exists.

		#createEffect1(fn: () => void) {
			let effect: Effect | null = null

			effect = createStoppableEffect(() => {
				if (effect) this.#effects.add(effect)
				// nest the user's effect so that if it re-runs a lot it is not deleting/adding from/to our #effects Set a lot.
				createEffect(fn)
				onCleanup(() => this.#effects.delete(effect!))
			})

			this.#effects.add(effect)
		}

		#stopEffects1() {
			for (const effect of this.#effects) effect.stop()
		}

		// Method 2 //////////////////////////////////////////
		// Works, with nesting, no leaks.

		#owner: Owner | null = null
		#dispose: (() => void) | null = null

		#createEffect2(fn: () => void) {
			if (!this.#owner) {
				createRoot(dispose => {
					this.#owner = getOwner()
					this.#dispose = dispose
					this.#createEffect2(fn)
				})
			} else {
				let owner = getOwner()
				while (owner && owner !== this.#owner) owner = owner?.owner ?? null

				// this.#owner found in the parents of current owner therefore,
				// run with current nested owner like a regular solid
				// createEffect()
				if (owner === this.#owner) return createEffect(fn)

				// this.#owner wasn't found on the parent owners
				// run with this.#owner
				runWithOwner(this.#owner, () => createEffect(fn))
			}
		}

		#stopEffects2() {
			this.#dispose?.()
		}
	}
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
