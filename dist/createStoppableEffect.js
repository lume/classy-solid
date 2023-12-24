import { createEffect, createSignal } from 'solid-js';
/**
 * NOTE: Experimental
 *
 * Create a stoppable effect.
 *
 * ```js
 * const effect = createStoppableEffect(() => {...})
 *
 * // ...later, stop the effect from running again.
 * effect.stop()
 * ```
 *
 * Note, this is experimental because when inside of a parent reactive context
 * that is long-lived (f.e. for life time of the app), each new effect created
 * with this and subsequently stopped will stick around and not be GC'd until
 * the parent context is cleaned up (which could be never).
 *
 * Stopped effects will currently only be GC'd freely when they are created
 * outside of a reactive context.
 */
export function createStoppableEffect(fn) {
  const [running, setRunning] = createSignal(true);
  createEffect(() => running() && fn());
  return {
    stop: () => setRunning(false),
    resume: () => setRunning(true)
  };
}
//# sourceMappingURL=createStoppableEffect.js.map