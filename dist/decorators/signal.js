import { batch } from 'solid-js';
import { getSignal__, trackPropSetAtLeastOnce__ } from '../signals/signalify.js';
import { isSignalGetter__, getMemberStat__, finalizeMembersIfLast__, getMembers__, signalifyIfNeeded__ } from '../_state.js';
import './metadata-shim.js';
const Undefined = Symbol();
const isExtending = new WeakSet();

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
 *
 *     createEffect(() => {
 *       console.log('count:', this.count)
 *     })
 *   }
 * }
 *
 * const counter = new Counter()
 *
 * // When extending a class with a signal field, the subclass can override
 * // the initial value while keeping base class effects and memos working:
 * class SubCounter extends Counter {
 *   ⁣@signal override count = 10 // starts at 10 instead of 0
 * }
 * ```
 */

export function signal(valueOrOptions, context) {
  // Used as `@signal` without options
  if (context) return signalImplementation(valueOrOptions, context);

  // Used as `@signal({...})` with options

  const options = valueOrOptions;
  return function (value, context) {
    return signalImplementation(value, context, options);
  };
}
function signalImplementation(value, context, options = {
  extend: true
}) {
  if (context.static) throw new Error('@signal is not supported on static fields yet.');
  options.extend ??= true;
  const {
    kind,
    name
  } = context;
  const metadata = context.metadata;
  const members = getMembers__(metadata);
  if (!(kind === 'field' || kind === 'accessor' || kind === 'getter' || kind === 'setter')) throw new InvalidSignalDecoratorError();
  if (kind === 'field') {
    if (context.private) throw new Error('@signal cannot signalify #private fields. Use a #private getter/setter or auto accessor instead. F.e. convert `@signal #foo = 0` to `@signal accessor #foo = 0`.');
    const stat = getMemberStat__(name, 'signal-field', members, context);
    stat.finalize = function () {
      signalifyIfNeeded__(this, stat);
    };
    context.addInitializer(function () {
      if (stat.reuseExistingSignal) {
        // Delete the value descriptor, put back the signal descriptor,
        // and set the new initial value.
        stat.newInitialValue = this[name];
        delete this[name];
        Object.defineProperty(this, name, stat.existingSignalDescriptor);
        this[name] = stat.newInitialValue;
      }
      finalizeMembersIfLast__(this, members);
    });
    return function (initialVal) {
      // Detect if we already have a signal for this instance, and if so
      // re-use it.  This allows base class effects to stay operational
      // instead of a new signal being created that the base class effect
      // won't track.
      const descriptor = Object.getOwnPropertyDescriptor(this, name);

      // If we already have a signal descriptor, we will re-use it, so
      // that any effects depending on it will continue to work.
      if (isSignalGetter__.has(descriptor?.get)) {
        stat.reuseExistingSignal = true;
        stat.newInitialValue = initialVal;
        stat.existingSignalDescriptor = descriptor;
      }

      // The engine will define the property with this value in a value
      // descriptor, which we need to convert to a signal accessor
      // descriptor again (or for first time).
      return initialVal;
    };
  }

  // It's ok that getters/setters/auto-accessors are not finalized the same
  // way as with fields above and as with memos/effects, because we do the set
  // up during decoration which happens well before any initializers (before
  // any memos and effects, so these will be tracked).
  else if (kind === 'accessor') {
    const {
      get,
      set
    } = value;
    const signalStorage = new WeakMap();
    let initialValue = Undefined;
    const init = initialVal => initialValue = initialVal;
    context.addInitializer(function () {
      // Locate the prototype of this auto accessor.
      const proto = getPrototypeOfMethodOrAccessor(this, name, newGet);

      // If not already deleted to unshadow base class accessor
      if (proto) {
        // While not on the current prototype, delete subclass descriptors if they are marked as extending.
        let currentProto = this;
        while (currentProto && currentProto !== proto) {
          const descriptor = Object.getOwnPropertyDescriptor(currentProto, name);
          const fn = descriptor?.get;

          // Delete the subclass descriptor to unshadow the base class
          // descriptor.
          if (fn && isExtending.has(fn)) delete currentProto[name];
          currentProto = currentProto.__proto__;
        }
      }
      Reflect.set(proto ?? this, name, initialValue, this);
    });
    function newGet() {
      getSignal__(this, signalStorage, initialValue)();
      return get.call(this);
    }
    if (options.extend) isExtending.add(newGet);
    function newSet(newValue) {
      // batch, for example in case setter calls super setter, to
      // avoid multiple effect runs on a single property set.
      batch(() => {
        set.call(this, newValue);
        trackPropSetAtLeastOnce__(this, name); // TODO still needed? test it. I think it is still needed for @lume/element.

        const s = getSignal__(this, signalStorage, initialValue);
        s(typeof newValue === 'function' ? () => newValue : newValue);
      });
    }
    const newValue = {
      init,
      get: newGet,
      set: newSet
    };
    isSignalGetter__.add(newValue.get);
    return newValue;
  } else if (kind === 'getter' || kind === 'setter') {
    const getOrSet = value;
    const initialValue = Undefined;
    if (!Object.hasOwn(metadata, 'classySolid_getterSetterSignals')) metadata.classySolid_getterSetterSignals = {};
    const signalsStorages = metadata.classySolid_getterSetterSignals;
    let signalStorage = signalsStorages[name];
    if (!signalStorage) signalsStorages[name] = signalStorage = new WeakMap();
    if (!Object.hasOwn(metadata, 'classySolid_getterSetterPairCounts')) metadata.classySolid_getterSetterPairCounts = {};
    const pairs = metadata.classySolid_getterSetterPairCounts;

    // Show a helpful error in case someone forgets to decorate both a getter and setter.
    queueMicrotask(() => {
      queueMicrotask(() => delete metadata.classySolid_getterSetterPairCounts);
      const missing = pairs[name] !== 2;
      if (missing) throw new MissingSignalDecoratorError(name);
    });
    if (kind === 'getter') {
      pairs[name] ??= 0;
      pairs[name]++;
      const newGetter = function () {
        getSignal__(this, signalStorage, initialValue)();
        return getOrSet.call(this);
      };
      isSignalGetter__.add(newGetter);
      return newGetter;
    } else {
      pairs[name] ??= 0;
      pairs[name]++;
      const newSetter = function (newValue) {
        // batch, for example in case setter calls super setter, to
        // avoid multiple effect runs on a single property set.
        batch(() => {
          getOrSet.call(this, newValue);
          trackPropSetAtLeastOnce__(this, name);
          const s = getSignal__(this, signalStorage, initialValue);
          s(typeof newValue === 'function' ? () => newValue : newValue);
        });
      };
      return newSetter;
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

// TODO move this to lowclass
function getPrototypeOfMethodOrAccessor(obj, name, fn) {
  let proto = Object.getPrototypeOf(obj);
  while (proto) {
    const descriptor = Object.getOwnPropertyDescriptor(proto, name);
    if (descriptor && (descriptor.get === fn || descriptor.set === fn || descriptor.value === fn)) return proto;
    proto = Object.getPrototypeOf(proto);
  }
  return null;
}
//# sourceMappingURL=signal.js.map