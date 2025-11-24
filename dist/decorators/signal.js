import { $PROXY } from 'solid-js';
import { getSignal__, trackPropSetAtLeastOnce__, signalify } from '../signals/signalify.js';
import { sortSignalsMemosInMetadata, isSignalGetter, getMemberStat, finalizeMemos, getSignalsAndMemos } from '../_state.js';
const Undefined = Symbol();

/**
 * @decorator
 * Decorate properties of a class with `@signal` to back them with Solid
 * signals, making them reactive.
 *
 * Related: See the Solid.js `createSignal` API for creating standalone signals.
 *
 * Example:
 *
 * ```js
 * import {signal} from 'classy-solid'
 * import {createEffect} from 'solid-js'
 *
 * class Counter {
 *   ⁣@signal count = 0
 *
 *   constructor() {
 *     setInterval(() => this.count++, 1000)
 *   }
 * }
 *
 * const counter = new Counter()
 *
 * createEffect(() => {
 *   console.log('count:', counter.count)
 * })
 * ```
 */
export function signal(value, context) {
  if (context.static) throw new Error('@signal is not supported on static fields yet.');
  const {
    kind,
    name
  } = context;
  const metadata = context.metadata;
  const signalsAndMemos = getSignalsAndMemos(metadata);
  if (!(kind === 'field' || kind === 'accessor' || kind === 'getter' || kind === 'setter')) throw new InvalidSignalDecoratorError();
  if (kind === 'field') {
    const stat = getMemberStat(name, 'signal-field', signalsAndMemos);
    context.addInitializer(function () {
      // Special case for Solid proxies: if the object is already a solid proxy,
      // all properties are already reactive, no need to signalify.
      // @ts-expect-error special indexed access
      const proxy = this[$PROXY];
      if (proxy) return;
      sortSignalsMemosInMetadata(metadata);
      if (stat.applied.get(this)) return;
      signalify(this, [name, this[name]]);
      stat.applied.set(this, true);

      // If we skipped memoifying prior memo members (accessor and method
      // memos) because of prior signal-fields, memo-fields, or
      // memo-auto-accessors, finalize those memos now.
      finalizeMemos(this, stat, signalsAndMemos);
    });
  } else if (kind === 'accessor') {
    const {
      get,
      set
    } = value;
    const signalStorage = new WeakMap();
    let initialValue = undefined;
    const newValue = {
      init: function (initialVal) {
        initialValue = initialVal;
        return initialVal;
      },
      get: function () {
        getSignal__(this, signalStorage, initialValue)();
        return get.call(this);
      },
      set: function (newValue) {
        set.call(this, newValue);
        trackPropSetAtLeastOnce__(this, name); // not needed anymore? test it

        const s = getSignal__(this, signalStorage, initialValue);
        s(typeof newValue === 'function' ? () => newValue : newValue);
      }
    };
    isSignalGetter.add(newValue.get);
    return newValue;
  } else if (kind === 'getter' || kind === 'setter') {
    const getOrSet = value;
    const initialValue = Undefined;
    if (!Object.hasOwn(metadata, 'getterSetterSignals')) metadata.getterSetterSignals = {};
    const signalsStorages = metadata.getterSetterSignals;
    let signalStorage = signalsStorages[name];
    if (!signalStorage) signalsStorages[name] = signalStorage = new WeakMap();
    if (!Object.hasOwn(metadata, 'getterSetterPairCounts')) metadata.getterSetterPairCounts = {};
    const pairs = metadata.getterSetterPairCounts;

    // Show a helpful error in case someone forgets to decorate both a getter and setter.
    queueMicrotask(() => {
      if (pairs[name] !== 2) throw new MissingSignalDecoratorError(name);
    });
    if (kind === 'getter') {
      pairs[name] ??= 0;
      pairs[name]++;
      const newGetter = function () {
        getSignal__(this, signalStorage, initialValue)();
        return getOrSet.call(this);
      };
      isSignalGetter.add(newGetter);
      return newGetter;
    } else {
      pairs[name] ??= 0;
      pairs[name]++;
      return function (newValue) {
        getOrSet.call(this, newValue);
        trackPropSetAtLeastOnce__(this, name);
        const s = getSignal__(this, signalStorage, initialValue);
        s(typeof newValue === 'function' ? () => newValue : newValue);
      };
    }
  }
}
class MissingSignalDecoratorError extends Error {
  constructor(prop) {
    super(`Missing @signal decorator on setter or getter for property "${String(prop)}". The @signal decorator will only work on a getter/setter pair with *both* getter and setter decorated with @signal.`);
  }
}
class InvalidSignalDecoratorError extends Error {
  constructor() {
    super('The @signal decorator is only for use on fields, getters, setters, and auto accessors.');
  }
}
//# sourceMappingURL=signal.js.map