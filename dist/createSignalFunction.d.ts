import type { Setter } from 'solid-js';
import type { SignalOptions } from 'solid-js/types/reactive/signal';
export type SignalFunction<T> = {
    (): T;
} & Setter<T>;
export declare function createSignalFunction<T>(): SignalFunction<T | undefined>;
export declare function createSignalFunction<T>(value: T, options?: SignalOptions<T>): SignalFunction<T>;
//# sourceMappingURL=createSignalFunction.d.ts.map