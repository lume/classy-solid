import type { SignalOptions } from 'solid-js/types/reactive/signal';
import type { Signal } from 'solid-js/types/reactive/signal';
export interface SignalObject<T> {
    get: Signal<T>[0];
    set: (v: T | ((prev: T) => T)) => T;
}
export declare function createSignalObject<T>(): SignalObject<T | undefined>;
export declare function createSignalObject<T>(value: T, options?: SignalOptions<T>): SignalObject<T>;
//# sourceMappingURL=createSignalObject.d.ts.map