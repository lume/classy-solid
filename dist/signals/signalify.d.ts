import { type SignalFunction } from './createSignalFunction.js';
/**
 * Convert properties on an object into Solid signal-backed properties.
 *
 * There are two ways to use this:
 *
 * 1. Define which properties to convert to signal-backed properties by
 * providing property names as trailing arguments. Properties that are
 * function-valued (methods) are included as values of the signal properties.
 * 2. If no property names are provided, all non-function-valued properties on
 * the object will be automatically converted to signal-backed properties.
 *
 * If any property is already memoified with `memoify()`, or already signalified
 * with `signalify()`, it will be skipped.
 *
 * Example with a class:
 *
 * ```js
 * import {signalify} from 'classy-solid'
 * import {createEffect} from 'solid-js'
 *
 * class Counter {
 *   count = 0
 *
 *   constructor() {
 *     signalify(this, 'count')
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
 *
 * Example with a plain object:
 *
 * ```js
 * import {signalify} from 'classy-solid'
 * import {createEffect} from 'solid-js'
 *
 * const counter = {
 *   count: 0
 * }
 *
 * signalify(counter, 'count')
 * setInterval(() => counter.count++, 1000)
 *
 * createEffect(() => {
 *   console.log('count:', counter.count)
 * })
 * ```
 */
export declare function signalify<T extends object, K extends keyof T>(obj: T): T;
export declare function signalify<T extends object>(obj: T, ...props: (keyof T)[]): T;
/** This overload is for initial value support for downstream use cases. */
export declare function signalify<T extends object>(obj: T, ...props: [key: keyof T, initialValue: unknown][]): T;
export declare function isPropSetAtLeastOnce__(instance: object, prop: string | symbol): boolean;
export declare function trackPropSetAtLeastOnce__(instance: object, prop: string | symbol): void;
export declare function createSignalAccessor__<T extends object>(obj: T, prop: Exclude<keyof T, number>, initialVal: unknown, skipFunctionProperties?: boolean): void;
export declare function getSignal__(obj: object, storage: WeakMap<object, SignalFunction<unknown>>, initialVal: unknown): SignalFunction<unknown>;
//# sourceMappingURL=signalify.d.ts.map