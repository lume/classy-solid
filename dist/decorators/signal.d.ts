import './metadata-shim.js';
interface SignalOptions {
    /**
     * Whether to extend an existing base class signal instead of creating a new
     * one. When true, the existing signal is reused, otherwise a new signal
     * overrides the existing one from the base class.
     *
     * Defaults to true, as typically we want base class effects and memos to
     * keep working when a subclass overrides a signal property.
     */
    extend?: boolean;
}
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
export declare function signal(value: unknown, context: ClassFieldDecoratorContext | ClassGetterDecoratorContext | ClassSetterDecoratorContext | ClassAccessorDecoratorContext): any;
export declare function signal(options: SignalOptions): typeof signalImplementation;
declare function signalImplementation(value: unknown, context: ClassFieldDecoratorContext | ClassGetterDecoratorContext | ClassSetterDecoratorContext | ClassAccessorDecoratorContext, options?: SignalOptions): any;
export {};
//# sourceMappingURL=signal.d.ts.map