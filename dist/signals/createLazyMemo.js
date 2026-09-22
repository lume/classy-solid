import { createMemo, getOwner, runWithOwner } from 'solid-js';
import { createWritableMemo } from '@solid-primitives/memo';

/**
 * Creates a memo that defers its computation until the first read.
 *
 * Solid's `createMemo` runs the computation immediately when called. That is
 * a problem when the memo is created during class field initialization but
 * reads fields that are declared later (they are still `undefined`), or when
 * a memo may never be read at all. `createLazyMemo` only creates the
 * underlying Solid memo on the first call of the returned accessor.
 *
 * The owner is captured at the *call site* of `createLazyMemo`, not at first
 * read. The first read usually happens inside some dependent effect; creating
 * the memo there would let that effect own it and dispose it on its next
 * re-run, silently breaking reactivity after one update. To create the memo
 * under a specific owner, call `createLazyMemo` inside
 * `runWithOwner(owner, () => createLazyMemo(...))`.
 *
 * After the first read, behavior is identical to `createMemo` /
 * `createWritableMemo`: cached, tracks dependencies, recomputes only when they
 * change.
 *
 * The `(fn, value, options)` shape mirrors Solid's `createMemo`, so `value` is
 * the initial value passed as `prev` to `fn` on its first run.
 *
 * Returns a tuple: `[get]` for readonly memos, `[get, set]` when
 * `options.writable` is `true`.
 *
 * @example
 * ```ts
 * const [a, setA] = createSignal(1)
 * const [double] = createLazyMemo(() => a() * 2) // nothing computed yet
 * createEffect(() => console.log(double())) // memo created here, logs 2
 * setA(5) // logs 10
 * ```
 */

export function createLazyMemo(fn, value, options = {}) {
  // Capture the owner now (call site), not at first read. See JSDoc.
  const owner = getOwner();
  let memo;
  const ensure = () => memo ??= runWithOwner(owner, () => options.writable ? createWritableMemo(fn, value, options) : [createMemo(fn, value, options)]);
  const get = () => ensure()[0]();
  const set = v => ensure()[1](v);
  return options.writable ? [get, set] : [get];
}
//# sourceMappingURL=createLazyMemo.js.map