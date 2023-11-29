import type { PropKey, PropSpec } from './types.js';
/**
 * Provides a key for accessing internal APIs. If any other module tries to get
 * this, an error will be thrown, and signal and reactive decorators will not
 * work.
 */
export declare function getKey(): symbol;
/**
 * This function provides propsToSignalify to only one external module
 * (reactive.ts). The purpose of this is to keep the API private for reactive.ts
 * only, otherwise an error will be thrown that breaks signal/reactive
 * functionality.
 */
export declare function getPropsToSignalify(key: symbol): Map<PropKey, PropSpec>;
/**
 * Only the module that first gets the key can call this function (it should be
 * reactive.ts)
 */
export declare function resetPropsToSignalify(key: symbol): void;
/**
 * @decorator
 * Decorate properties of a class with `@signal` to back them with Solid
 * signals, making them reactive. Don't forget that the class in which `@signal`
 * is used must be decorated with `@reactive`.
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
export declare function signal(_: unknown, context: ClassFieldDecoratorContext | ClassGetterDecoratorContext | ClassSetterDecoratorContext): any;
//# sourceMappingURL=signal.d.ts.map