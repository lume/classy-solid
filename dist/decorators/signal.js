import { $PROXY } from 'solid-js';
import { __getSignal, __trackPropSetAtLeastOnce, signalify } from '../signals/signalify.js';
import { __sortSignalsMemosInMetadata, isSignalGetter } from '../signals/_state.js';
import { memoify } from '../signals/memoify.js';
export let __propsToSignalify = new Map();
export function __resetPropsToSignalify() {
  __propsToSignalify = new Map();
}
const Undefined = Symbol();

/**
 * @decorator
 * Decorate properties of a class with `@signal` to back them with Solid
 * signals, making them reactive. Don't forget that the class in which `@signal`
 * is used must be decorated with `@reactive`.
 *
 * Related: See the Solid.js `createSignal` API for creating signals.
 *
 * Example:
 *
 * ```js
 * import {reactive, signal} from 'classy-solid'
 * import {createEffect} from 'solid-js'
 *
 * ⁣@reactive
 * class Counter {
 *   ⁣@signal count = 0
 *
 *   constructor() {
 *     setInterval(() => this.count++, 1000)
 *   }
 * }
 *
 * const counter = new Counter
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
  if (!(kind === 'field' || kind === 'accessor' || kind === 'getter' || kind === 'setter')) throw new InvalidSignalDecoratorError();

  // const props = __propsToSignalify

  // @prod-prune
  // queueReactiveDecoratorChecker(props)

  const metadata = context.metadata;
  if (!Object.hasOwn(metadata, 'signalFieldsAndMemos')) metadata.signalFieldsAndMemos = [];
  const signalsAndMemos = metadata.signalFieldsAndMemos;
  if (kind === 'field') {
    // if (context.private && name !== '#finalize') throw new Error('@signal is not supported on private fields yet.')

    // if (name === '#finalize') __propsToSignalify = new Map<PropKey, PropSpec>() // reset
    // else props.set(name, {initialValue: undefined, kind})

    // return function (this: object, initialValue: unknown) {
    // 	if (name === '#finalize') {
    // 		// Special case for Solid proxies: if the object is already a solid proxy,
    // 		// all properties are already reactive, no need to signalify.
    // 		// @ts-expect-error special indexed access
    // 		const proxy = this[$PROXY] as T
    // 		if (proxy) return this

    // 		for (const [prop, propSpec] of props) {
    // 			let initialValue = propSpec.initialValue

    // 			// @prod-prune
    // 			if (!Object.hasOwn(this, prop)) throw new PropNotFoundError(prop)

    // 			__createSignalAccessor(this as any, prop, initialValue)
    // 		}
    // 		return
    // 	}

    // 	props.get(name)!.initialValue = initialValue
    // 	return initialValue
    // }

    let stat = signalsAndMemos.find(([key]) => key === name)?.[1];
    if (!stat) signalsAndMemos.push([name, stat = {
      type: 'signal-field',
      applied: new WeakMap()
    }]);
    context.addInitializer(function () {
      // Special case for Solid proxies: if the object is already a solid proxy,
      // all properties are already reactive, no need to signalify.
      // @ts-expect-error special indexed access
      const proxy = this[$PROXY];
      if (proxy) return;
      __sortSignalsMemosInMetadata(metadata);

      // __createSignalAccessor(this as any, name, value)

      if (stat.applied.get(this)) return;
      signalify(this, [name, this[name]]);
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
        __getSignal(this, signalStorage, initialValue)();
        return get.call(this);
      },
      set: function (newValue) {
        set.call(this, newValue);
        __trackPropSetAtLeastOnce(this, name); // not needed anymore? test it

        const s = __getSignal(this, signalStorage, initialValue);
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
        __getSignal(this, signalStorage, initialValue)();
        return getOrSet.call(this);
      };
      isSignalGetter.add(newGetter);
      return newGetter;
    } else {
      pairs[name] ??= 0;
      pairs[name]++;
      return function (newValue) {
        getOrSet.call(this, newValue);
        __trackPropSetAtLeastOnce(this, name);
        const s = __getSignal(this, signalStorage, initialValue);
        s(typeof newValue === 'function' ? () => newValue : newValue);
      };
    }
  }
}

// let checkerQueued = false

/**
 * This throws an error in some cases of an end dev forgetting to decorate a
 * class with `@reactive` if they used `@signal` on that class's fields.
 *
 * This doesn't work all the time, only when the very last class decorated is
 * missing @reactive, but something is better than nothing. There's another
 * similar check performed in the `@reactive` decorator.
 */
// function queueReactiveDecoratorChecker(props: Map<PropKey, PropSpec>) {
// 	if (checkerQueued) return
// 	checkerQueued = true

// 	queueMicrotask(() => {
// 		checkerQueued = false

// 		// If the refs are still equal, it means @reactive did not run (forgot
// 		// to decorate a class that uses @signal with @reactive).
// 		if (props === __propsToSignalify) {
// 			throw new Error(
// 				// Array.from(map.keys()) instead of [...map.keys()] because it breaks in Oculus browser.
// 				`Stray @signal-decorated properties detected: ${Array.from(props.keys()).join(
// 					', ',
// 				)}. Did you forget to use the \`@reactive\` decorator on a class that has properties decorated with \`@signal\`?`,
// 			)
// 		}
// 	})
// }

// class PropNotFoundError extends Error {
// 	constructor(prop: PropertyKey) {
// 		super(
// 			`Property "${String(
// 				prop,
// 			)}" not found on instance of class decorated with \`@reactive\`. Did you forget to use the \`@reactive\` decorator on one of your classes that has a "${String(
// 				prop,
// 			)}" property decorated with \`@signal\`?`,
// 		)
// 	}
// }

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