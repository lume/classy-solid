import { createComputed } from 'solid-js';

/**
 * Syncs two signals together so that setting one signal's value updates the
 * other, and vice versa, without an infinite loop.
 *
 * Example:
 *
 * ```js
 * const [foo, setFoo] = createSignal(0)
 * const [bar, setBar] = createSignal(0)
 *
 * syncSignals(foo, setFoo, bar, setBar)
 *
 * createEffect(() => console.log(foo(), bar()))
 *
 * setFoo(1) // logs "1 1"
 * setBar(2) // logs "2 2"
 * ```
 *
 * It returns the getters/setters, so it is possible to also create the signals
 * and sync them at once:
 *
 * ```js
 * const [[foo, setFoo], [bar, setBar]] = syncSignals(...createSignal(0), ...createSignal(0))
 *
 * createEffect(() => console.log(foo(), bar()))
 *
 * setFoo(1) // logs "1 1"
 * setBar(2) // logs "2 2"
 * ```
 */
export function syncSignals(getterA, setterA, getterB, setterB) {
  let settingB = false;
  let settingA = false;
  createComputed(
  // @ts-ignore not all code paths return
  () => {
    const _a = getterA();
    if (settingA) return settingA = false;
    settingB = true;
    setterB(_a);
  });
  createComputed(
  // @ts-ignore not all code paths return
  () => {
    const _b = getterB();
    if (settingB) return settingB = false;
    settingA = true;
    setterA(_b);
  });
  return [[getterA, setterA], [getterB, setterB]];
}
//# sourceMappingURL=syncSignals.js.map