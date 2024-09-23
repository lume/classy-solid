/**
 * Convert properties on an object into Solid signal-backed properties.
 *
 * There are two ways to use this: either by defining which properties to
 * convert to signal-backed properties by providing an array as property names
 * in the second arg, which is useful on plain objects, or by passing in `this`
 * and `this.constructor` within the `constructor` of a class that has
 * properties decorated with `@signal`.
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
export declare function signalify<T extends object>(obj: T, ...props: [key: keyof T, initialValue: unknown][]): T;
/**
 * This ensures that `createSignalAccessor` is kept internal to classy-solid only.
 */
export declare function getCreateSignalAccessor(): typeof createSignalAccessor;
export declare function __isPropSetAtLeastOnce(instance: object, prop: string | symbol): boolean;
declare function createSignalAccessor<T extends object>(obj: T, prop: Exclude<keyof T, number>, initialVal: unknown): void;
export {};
//# sourceMappingURL=signalify.d.ts.map