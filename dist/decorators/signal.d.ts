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
export declare function signal(value: unknown, context: ClassFieldDecoratorContext | ClassGetterDecoratorContext | ClassSetterDecoratorContext | ClassAccessorDecoratorContext): any;
//# sourceMappingURL=signal.d.ts.map