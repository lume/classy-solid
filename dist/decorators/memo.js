import { finalizeMembersIfLast, getMemberStat, getMembers, memoifyIfNeeded } from '../_state.js';
import './metadata-shim.js';

/**
 * A decorator that make a signal property derived from a memoized computation
 * based on other signals. Effects depending on this property will re-run when
 * the computed value changes, but not if the computed value stays the same even
 * if the dependencies changed.
 *
 * @example
 * ```ts
 * import {reactive, signal, memo} from "classy-solid";
 *
 * class Example {
 *   @signal a = 1
 *   @signal b = 2
 *
 *   // @memo can be used on a getter, accessor, or method, with readonly and
 *   // writable variants:
 *
 *   // Readonly memo via getter only
 *   @memo get sum1() {
 *     return this.a + this.b
 *   }
 *
 *   // Writable memo via getter with setter
 *   @memo get sum2() {
 *     return this.a + this.b
 *   }
 *   @memo set sum2(value: number) {
 *     // use an empty setter to enable writable (logic in here will be ignored if any)
 *   }
 *
 *   // Readonly memo via auto accessor (requires arrow function, not writable because no parameter (arity = 0))
 *   @memo accessor sum3 = () => this.a + this.b
 *
 *   // Writable memo via auto accessor (requires arrow function with parameter, arity > 0)
 *   // Ignore the parameter, it only enables writable memo
 *   @memo accessor sum4 = (v?: number) => this.a + this.b
 *
 *   // Readonly memo via method
 *   @memo sum5() {
 *     return this.a + this.b
 *   }
 *
 *   // Writable memo via method with parameter (arity > 0)
 *   @memo sum6(value?: number) {
 *     // Ignore the parameter, it only enables writable memo
 *     return this.a + this.b
 *   }
 *
 *   // The following variants are not supported yet as no runtime or TS support exists yet for the syntax.
 *
 *   // Writable memo via accessor, alternative long-hand syntax (not yet released, no runtime or TS support yet)
 *   @memo accessor sum6 { get; set } = () => this.a + this.b
 *
 *   // Readonly memo via accessor with only getter (not released yet, no runtime or TS support yet)
 *   @memo accessor sum7 { get; } = () => this.a + this.b
 *
 *   // Readonly memo via accessor with only getter, alternative syntax (not released yet, no runtime or TS support yet)
 *   @memo accessor sum8 {
 *     get() {
 *       return this.a + this.b
 *     }
 *   }
 *
 *   // Readonly memo via accessor with only getter, alternative syntax (not released yet, no runtime or TS support yet)
 *   @memo accessor sum8 {
 *     get() {
 *       return this.a + this.b
 *     }
 *     set(_v: number) {
 *       // empty setter makes it writable (logic in here will be ignored if any)
 *     }
 *   }
 * }
 *
 * const ex = new Example()
 *
 * console.log(ex.sum1, ex.sum2, ex.sum3(), ex.sum4(), ex.sum5(), ex.sum6()) // 3 3 3 3 3 3
 *
 * createEffect(() => {
 *   console.log(ex.sum1, ex.sum2, ex.sum3(), ex.sum4(), ex.sum5(), ex.sum6())
 * });
 *
 * ex.a = 5 // Logs: 7 7 7 7 7 7
 *
 * // This won't log anything since the computed memo values don't change (all still 7).
 * batch(() => {
 *   ex.a = 3
 *   ex.b = 4
 * })
 *
 * ex.sum2 = 20 // Logs: 20 7 7 7 7 7 (only sum2 is updated)
 *
 * ex.sum6(15) // Logs: 20 7 7 7 7 15 (only sum6 is updated)
 *
 * ex.sum1 = 10 // Runtime error: Cannot set readonly property "sum1".
 * ```
 */
export function memo(value,
// today's auto-accessors, writable memo
context) {
  if (context.static) throw new Error('@memo is not supported on static fields yet.');
  const {
    kind,
    name
  } = context;
  const metadata = context.metadata;
  const signalsAndMemos = getMembers(metadata);

  // Apply finalization logic to all except setters (setters are finalized
  // together with their getters).
  // By skipping setters we also avoid double-counting the getter+setter pair
  // in the finalizeMembersIfLast logic.
  if (kind === 'setter') return;

  // @ts-expect-error skip type checking in case of invalid kind in plain JS
  if (kind === 'field') throw new Error('@memo is not supported on class fields.');
  const memberType = kind === 'accessor' ? 'memo-auto-accessor' : kind === 'method' ? 'memo-method' : 'memo-accessor';
  const stat = getMemberStat(name, memberType, signalsAndMemos);
  stat.finalize = function () {
    memoifyIfNeeded(this, name, stat);
  };
  context.addInitializer(function () {
    finalizeMembersIfLast(this, signalsAndMemos);
  });
  if (kind === 'method' || kind === 'getter') stat.value = value;else if (kind === 'accessor') stat.value = value.get;
}
//# sourceMappingURL=memo.js.map