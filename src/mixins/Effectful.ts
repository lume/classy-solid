import {
	type Owner,
	type Accessor,
	type Setter,
	type MemoOptions,
	createEffect,
	createRoot,
	createSignal,
	getOwner,
	runWithOwner,
	onCleanup,
} from 'solid-js'
import type {AnyConstructor} from 'lowclass/dist/Constructor.js'
import {createLazyMemo, type LazyMemoOptions} from '../signals/createLazyMemo.js'

const isInstance = Symbol()

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
export function Effectful<T extends AnyConstructor>(Base: T) {
	if (Base.prototype instanceof Effectful)
		throw new Error('Base class already extends Effectful, no need to apply the mixin again.')

	class EffectfulClass extends Base {
		// Use `any` to prevent subclass "has or is using private name" errors.
		get [isInstance as any]() {
			return true
		}

		#effectFunctions: Array<() => void> = []
		#started = true

		/**
		 * Create a Solid.js effect. The difference from regular
		 * `createEffect()` is that `this` tracks the effects created, so that
		 * they can all be stopped with `this.stopEffects()`.
		 *
		 * Note, if effects are stopped, this starts them again, before
		 * creating the new effect. All effects are always all started, or all
		 * stopped.
		 */
		createEffect(fn: () => void) {
			this.startEffects()
			this.#createEffect(fn)
		}

		/**
		 * Adds an effect function to the list of tracked effects without
		 * starting it. This is useful for adding an effect, then using
		 * `startEffects()` later to start all effects at once.
		 *
		 * The `@effect` decorator uses this internally when its `autoStart`
		 * option is set to `false`.
		 */
		addEffectFn(fn: () => void) {
			this.#effectFunctions.push(fn)
		}

		#isRestarting = false

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
			if (this.#started) return
			this.#started = true

			// Notify memo dependents FIRST, while none of our effects exist yet:
			// external dependents re-run, read the memo accessors, and lazily
			// recreate the memos. Bumping after recreating our own effects
			// would make every one of them run twice per start.
			const [, setMemoVersion] = this.#memoVersion
			setMemoVersion(v => v + 1)

			// Restart all stored effect functions
			this.#isRestarting = true
			try {
				for (const fn of this.#effectFunctions) this.#createEffect(fn)
			} finally {
				this.#isRestarting = false
			}
		}

		/**
		 * Stop all of the effects that were created.
		 */
		stopEffects() {
			if (!this.#started) return
			this.#started = false

			this.#dispose?.()
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
			this.stopEffects()
			this.#effectFunctions = []
		}

		#parentOwner: Owner | null = getOwner()

		#dispose!: () => void

		#owner: Owner = (() => {
			let owner: Owner

			runWithOwner(this.#parentOwner, () => {
				createRoot(dispose => {
					owner = getOwner()!
					this.#dispose = dispose
				})

				// Route parent cleanup through stopEffects() so #started stays
				// truthful: effects and memos are disposed AND the instance
				// knows it is stopped, so memo reads fall back to a plain
				// compute instead of reviving the root, and a later
				// startEffects() can legitimately bring everything back.
				if (this.#parentOwner) onCleanup(() => this.stopEffects())
			})

			return owner!
		})()

		#createEffect(fn: () => void) {
			const callContext = getOwner()
			const contextIsChild = ownerIsAncestor(this.#owner, callContext)
			const contextIsParent = ownerIsAncestor(callContext, this.#owner)

			// If nested in an effect under our effect tree, delegate to regular
			// createEffect.
			// I.e. Effects are hooked onto our root with runWithOwner, unless
			// this.createEffect is called with an owner that is a descendant of
			// our owner (f.e. a nested effect)
			if (!this.#isRestarting)
				if (contextIsChild) return createEffect(fn)
				else if (contextIsParent && callContext !== this.#parentOwner)
					throw new Error('Do not call .startEffects or .createEffect methods in parent reactive contexts.')

			// Store top-level effect functions so they can be replayed when
			// startEffects() is called
			if (!this.#isRestarting) this.#effectFunctions.push(fn)

			runWithOwner(this.#owner, () => createEffect(fn))
		}

		/**
		 * One restart signal per instance. Every Effectful-owned memo accessor
		 * reads it, so bumping it once in `startEffects()` re-runs every
		 * dependent of every memo, which then lazily recreates the memos.
		 */
		#memoVersion = createSignal(0)

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
		createMemo<T>(fn: (prev: T | undefined) => T, value?: T, options?: MemoOptions<T>): Accessor<T> {
			return this.#memo(fn, value, {...options, writable: false})[0]
		}

		/**
		 * Like `createMemo()`, but returns `[get, set]` where `set` overrides
		 * the memo's value until a dependency next changes (backed by
		 * `createWritableMemo` from `@solid-primitives/memo`). Writing while
		 * effects are stopped throws.
		 */
		createWritableMemo<T>(
			fn: (prev: T | undefined) => T,
			value?: T,
			options?: MemoOptions<T>,
		): [get: Accessor<T>, set: Setter<T>] {
			return this.#memo(fn, value, {...options, writable: true}) as [Accessor<T>, Setter<T>]
		}

		#memo<T>(
			fn: (prev: T | undefined) => T,
			value: T | undefined,
			options: LazyMemoOptions<T>,
		): readonly [get: Accessor<T>, set?: Setter<T>] {
			const callContext = getOwner()
			const contextIsChild = ownerIsAncestor(this.#owner, callContext)
			const contextIsParent = ownerIsAncestor(callContext, this.#owner)

			// Same three-way classification as #createEffect.
			if (contextIsChild) return createLazyMemo(fn, value, options) // owner = callContext (captured inside)
			if (contextIsParent && callContext !== this.#parentOwner)
				throw new Error('Do not call .createMemo or .createWritableMemo methods in parent reactive contexts.')

			return this.#lazyMemo(fn, value, options) // owner = #owner
		}

		#lazyMemo<T>(
			fn: (prev: T | undefined) => T,
			value: T | undefined,
			options: LazyMemoOptions<T>,
		): readonly [get: Accessor<T>, set?: Setter<T>] {
			let memo: readonly [get: Accessor<T>, set?: Setter<T>] | undefined

			const ensure = () =>
				(memo ??= runWithOwner(this.#owner, () => {
					// Registered on the ROOT, so it fires whenever the root is
					// cleaned — by stopEffects() or by #parentOwner's cleanup.
					// Co-locating the reset with the creation means
					// stopEffects() needs no memo bookkeeping. This
					// runWithOwner is also the owner createLazyMemo captures.
					onCleanup(() => (memo = undefined))
					return createLazyMemo(fn, value, options)
				})!)

			const get: Accessor<T> = () => {
				const [memoVersion] = this.#memoVersion
				memoVersion() // dependents re-run after startEffects()

				// Stopped: behave like a plain derived getter. Nothing is
				// created, nothing can leak. No memo exists, so there is no
				// previous value; pass the initial value.
				if (!this.#started) return fn(value)

				return ensure()[0]()
			}

			const set: Setter<T> = ((v: unknown) => {
				if (!this.#started) throw new Error('Cannot write to a memo while effects are stopped.')
				return ensure()[1]!(v as any)
			}) as Setter<T>

			return options.writable ? ([get, set] as const) : ([get] as const)
		}
	}

	return EffectfulClass
}

export type AnyEffectful = InstanceType<ReturnType<typeof Effectful>>

export function isAnyEffectful(o: any): o is AnyEffectful {
	return Boolean(o && o[isInstance])
}

Object.defineProperty(Effectful, Symbol.hasInstance, {value: isAnyEffectful})

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

function ownerIsAncestor(maybeParent: Owner | null, maybeChild: Owner | null): boolean {
	if (!maybeParent) return false

	let current: Owner | null = maybeChild

	while (current) {
		if (current.owner === maybeParent) return true
		current = current.owner
	}

	return false
}
