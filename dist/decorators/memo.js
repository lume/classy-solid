import { createMemo } from 'solid-js';
import { createWritableMemo } from '@solid-primitives/memo';
import { memoify } from '../signals/memoify.js';
import { __sortSignalsMemosInMetadata } from '../signals/_state.js';
createMemo;
createWritableMemo;

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
 * @reactive
 * class Example {
 *   @signal a = 1
 *   @signal b = 2
 *
 *   // @memo can be used on a field, getter, or accessor.
 *
 *   // Writable memo via field (requires arrow function, not great for TypeScript type inference)
 *   @memo sum = () => this.a + this.b
 *
 *   // Readonly memo via getter only
 *   @memo get sum2() {
 *     return this.a + this.b
 *   }
 *
 *   // Writable memo via accessor (requires arrow function, not great for TypeScript type inference)
 *   @memo accessor sum3 = () => this.a + this.b
 *
 *   // Readonly memo via method
 *   @memo sum4() {
 *     return this.a + this.b
 *   }
 *
 *   // The following variants are not supported yet as no runtime or TS support exists yet for the syntax.
 *
 *   // Writable memo via accessor, alternative long-hand syntax (not yet released, no runtime or TS support yet)
 *   @memo accessor sum5 { get; set } = () => this.a + this.b
 *
 *   // Readonly memo via accessor with only getter (not released yet, no runtime or TS support yet)
 *   @memo accessor sum6 { get; } = () => this.a + this.b
 *
 *   // Readonly memo via accessor with only getter, alternative syntax (not released yet, no runtime or TS support yet)
 *   @memo accessor sum7 {
 *     get() {
 *       return this.a + this.b
 *     }
 *   }
 * }
 *
 * const ex = new Example();
 *
 * console.log(ex.sum, ex.sum2, ex.sum3, ex.sum4);  // 3 3 3 3
 *
 * createEffect(() => {
 *   console.log(ex.sum, ex.sum2, ex.sum3, ex.sum4);
 * });
 *
 * ex.a = 5; // Logs: 7 7 7 7
 *
 * // This won't log anything since the computed memo values don't change (all still 7).
 * batch(() => {
 *   ex.a = 3;
 *   ex.b = 4;
 * })
 *
 * ex.sum = 20; // Logs: 20 7 7 7 (only sum is updated)
 * ```
 */
export function memo(_value,
// today's auto-accessors, writable memo
// | {get: () => any; set?: (v: any) => void} // future grouped accessors
// | {get?: () => any; set: (v: any) => void}, // future grouped accessors
context) {
  if (context.static) throw new Error('@memo is not supported on static fields yet.');
  const {
    kind,
    name
  } = context;
  const metadata = context.metadata;
  if (!Object.hasOwn(metadata, 'signalFieldsAndMemos')) metadata.signalFieldsAndMemos = [];
  const signalsAndMemos = metadata.signalFieldsAndMemos;
  if (kind === 'field') {
    let stat = signalsAndMemos.find(([key]) => key === name)?.[1];
    if (!stat) signalsAndMemos.push([name, stat = {
      type: 'memo-field',
      applied: new WeakMap()
    }]);
    context.addInitializer(function () {
      __sortSignalsMemosInMetadata(metadata);
      if (stat.applied.get(this)) return;
      memoify(this, name);
      stat.applied.set(this, true);
      const last = signalsAndMemos.findLast(([_, {
        type
      }]) => type === 'signal-field' || type === 'memo-field' || type === 'memo-auto-accessor');
      const [, lastStat] = last;
      if (stat !== lastStat) return;

      // All signal-fields, memo-fields, and memo-auto-accessors have been
      // initialized. Now initialize memo fields that were waiting for
      // those to be ready.
      for (const [key, stat] of signalsAndMemos) {
        if (!(stat.type === 'memo-accessor' || stat.type === 'memo-method') || stat.applied.get(this)) continue;
        memoify(this, key);
      }
    });
  } else if (kind === 'accessor') {
    let stat = signalsAndMemos.find(([key]) => key === name)?.[1];
    if (!stat) signalsAndMemos.push([name, stat = {
      type: 'memo-auto-accessor',
      applied: new WeakMap()
    }]);
    context.addInitializer(function () {
      __sortSignalsMemosInMetadata(metadata);
      if (stat.applied.get(this)) return;
      memoify(this, true, name);
      stat.applied.set(this, true);
      const last = signalsAndMemos.findLast(([_, {
        type
      }]) => type === 'signal-field' || type === 'memo-field' || type === 'memo-auto-accessor');
      const [, lastStat] = last;
      if (stat !== lastStat) return;

      // All signal-fields, memo-fields, and memo-auto-accessors have been
      // initialized. Now initialize memo fields that were waiting for
      // those to be ready.
      for (const [key, stat] of signalsAndMemos) {
        if (!(stat.type === 'memo-accessor' || stat.type === 'memo-method') || stat.applied.get(this)) continue;
        memoify(this, key);
      }
    });
  } else if (kind === 'method') {
    let stat = signalsAndMemos.find(([key]) => key === name)?.[1];
    if (!stat) signalsAndMemos.push([name, stat = {
      type: 'memo-method',
      applied: new WeakMap()
    }]);
    context.addInitializer(function () {
      __sortSignalsMemosInMetadata(metadata);

      // If any signal-fields, memo-fields, or memo-auto-accessors are
      // defined on the class before this memo field, skip memoifying now.
      // We'll memoify later after signal fields are initialized
      for (const [key, stat] of signalsAndMemos) {
        if ((stat.type === 'signal-field' || stat.type === 'memo-field' || stat.type === 'memo-auto-accessor') && !stat.applied.get(this)) return;
        if (key === name) break; // reached our own memo field, no prior signal-fields or memo-auto-accessors found
      }
      memoify(this, name);
    });
  } else if (kind === 'getter' || kind === 'setter') {
    // if (!Object.hasOwn(metadata, 'memoStoragesPerProp')) metadata.memoStoragesPerProp = {}
    // const memoStorages = metadata.memoStoragesPerProp as MemoStorages

    // let memoStorage = memoStorages[name]
    // if (!memoStorage) memoStorages[name] = memoStorage = {storage: new WeakMap()}

    // if (!Object.hasOwn(metadata, 'getterSetterPairs')) metadata.getterSetterPairs = {}
    // const pairs = metadata.getterSetterPairs as {[key: PropKey]: 0 | 1 | 2}

    // context.addInitializer(function (this: unknown) {
    // 	// Show a helpful error in case someone forgets to decorate both a getter and setter.
    // 	// Best effort: this error may not always show, f.e. if a subclass overrides with only a getter.
    // 	if (getInheritedDescriptor(this as object, name as keyof object)?.set)
    // 		if (pairs[name] !== 2) throw new MissingDecoratorError(name)

    // 	// CONTINUE: this runs too early, before signals fields. :(
    // 	memoStorage.storage.set(this as object, createWritableMemo(memoStorage.getter!))
    // })

    // if (kind === 'getter') {
    // 	pairs[name] ??= 0
    // 	pairs[name]++

    // 	const getter = value as () => unknown
    // 	memoStorage.getter = getter

    // 	const newGetter = function (this: object): unknown {
    // 		const [read] = memoStorage.storage.get(this)!
    // 		return read()
    // 	}

    // 	isMemoGetter.add(newGetter)

    // 	return newGetter
    // } else {
    // 	pairs[name] ??= 0
    // 	pairs[name]++

    // 	// const setter = value as (val: unknown) => void

    // 	return function (this: object, newValue: any): any {
    // 		// setter.call(this, newValue)
    // 		// const s = __getMemo(this, memoStorage.storage, setter)
    // 		const [_, s] = memoStorage.storage.get(this)!
    // 		s(typeof newValue === 'function' ? () => newValue : newValue)
    // 	} as any // TypeScript type error workaround
    // }

    let stat = signalsAndMemos.find(([key]) => key === name)?.[1];
    if (!stat) signalsAndMemos.push([name, stat = {
      type: 'memo-accessor',
      applied: new WeakMap()
    }]);
    context.addInitializer(function () {
      __sortSignalsMemosInMetadata(metadata);

      // If any signal-fields, memo-fields, or memo-auto-accessors are
      // defined on the class before this memo field, skip memoifying now.
      // We'll memoify later after signal fields are initialized
      for (const [key, stat] of signalsAndMemos) {
        if ((stat.type === 'signal-field' || stat.type === 'memo-field' || stat.type === 'memo-auto-accessor') && !stat.applied.get(this)) return;
        if (key === name) break; // reached our own memo field, no prior signal-fields or memo-auto-accessors found
      }
      memoify(this, name);
    });
  }
}

// class MissingDecoratorError extends Error {
// 	constructor(prop: PropertyKey) {
// 		super(
// 			`Missing @memo decorator on setter or getter for property "${String(
// 				prop,
// 			)}". The @memo decorator will only work on a getter/setter pair with *both* getter and setter decorated with @memo.`,
// 		)
// 	}
// }

// function __getMemo(obj: object, storage: MemoStorage, fn: () => unknown) {
// 	let m = storage.get(obj)
// 	if (!m) storage.set(obj, (m = createWritableMemo(fn)))
// 	return m
// }
//# sourceMappingURL=memo.js.map