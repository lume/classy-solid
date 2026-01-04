import { effectifyIfNeeded__, finalizeMembersIfLast__, getMemberStat__, getMembers__, effects__ } from '../_state.js';
import './metadata-shim.js';

/**
 * Decorator for making Solid.js effects out of methods or function-valued
 * properties. This is more convenient than calling `this.createEffect()` in the
 * constructor or a class method, reducing boilerplate. Pair this with `@signal`
 * and `@memo` to make reactive classes with less code.
 *
 * The `@effect` decorator can be used on methods or auto accessors. Methods are
 * the recommended usage.
 *
 * When used on auto accessors, the auto accessor value must be a function. Note
 * that currently the auto accessor function value cannot be changed (if you
 * change it, the new function will not be used).
 *
 * Example:
 *
 * ```ts
 * import { effect, signal, stopEffects } from 'classy-solid'
 * import { createSignal } from 'solid-js'
 *
 * const [a, setA] = createSignal(1)
 *
 * class Funkalicious {
 *   @signal b = 2
 *
 *   @effect logSum() {
 *     console.log('Sum:', a() + this.b)
 *   }
 *
 *   // Not recommended, but supported (more concise for simple effects):
 *   @effect accessor logA = () => console.log('a:', a())
 * }
 *
 * const fun = new Funkalicious() // logs "Sum: 3"
 *
 * setA(5) // logs "Sum: 7", "a: 5"
 * fun.b = 10 // logs "Sum: 15"
 *
 * // Later, clean up when done...
 * stopEffects(fun)
 * ```
 *
 * When extending from Effectful() or Effects, the `stopEffects` method can
 * be used instead of the standalone `stopEffects()` function:
 *
 * ```ts
 * import { effect, signal, Effects } from 'classy-solid'
 * import { createSignal } from 'solid-js'
 *
 * const [a, setA] = createSignal(1)
 *
 * class Funkalicious extends Effects {
 *   @signal b = 2
 *
 *   @effect logSum() {
 *     console.log('Sum:', a() + this.b)
 *   }
 * }
 *
 * const fun = new Funkalicious() // logs "Sum: 3"
 *
 * setA(5) // logs "Sum: 7"
 * fun.b = 10 // logs "Sum: 15"
 *
 * // Later, clean up when done...
 * fun.stopEffects()
 * ```
 */
export function effect(value, context) {
  if (context.static) throw new Error('@effect is not supported on static members.');
  const {
    kind,
    name
  } = context;
  const metadata = context.metadata;
  const members = getMembers__(metadata);
  if (!(kind === 'method' || kind === 'accessor')) throw new Error('@effect can only be used on methods or function-valued auto accessors');
  const stat = kind === 'accessor' ? getMemberStat__(name, 'effect-auto-accessor', members, context) : getMemberStat__(name, 'effect-method', members, context);
  stat.finalize = function () {
    effectifyIfNeeded__(this, stat);
  };
  context.addInitializer(function () {
    finalizeMembersIfLast__(this, members);
  });
  if (kind === 'method') stat.value = value;else if (kind === 'accessor') stat.value = value.get;
}

/**
 * Starts all Solid.js effects created by the `@effect` decorator on the given
 * object. This can be used to restart effects that were previously stopped with
 * `stopEffects()`.
 *
 * Effects are created and started automatically, so this only needs to be
 * called if you have previously stopped the effects and want to start them
 * again.
 */
export function startEffects(obj) {
  let effects = effects__.get(obj);
  if (!effects) return;
  effects.startEffects();
}

/**
 * Stops all Solid.js effects created by the `@effect` decorator on the given
 * object. Use this once you are done with the instance and need to clean up.
 *
 * This does not needed to be used if the object is created in a reactive
 * context (such as inside a Solid.js component, or a nested effect), as those
 * effects will be cleaned up automatically when the owner context is cleaned
 * up.
 *
 * Effects that have been stopped can later be restarted by calling
 * `startEffects(obj)`.
 */
export function stopEffects(obj) {
  const effects = effects__.get(obj);
  if (!effects) return;
  effects.stopEffects();
}
//# sourceMappingURL=effect.js.map