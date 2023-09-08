import type { SignalOptions } from 'solid-js/types/reactive/signal';
export type SignalFunction<T> = {
    (v?: T | ((prev: T) => T)): T;
};
export declare function createSignalFunction<T>(): SignalFunction<T | undefined>;
export declare function createSignalFunction<T>(value: T, options?: SignalOptions<T>): SignalFunction<T>;
//# sourceMappingURL=createSignalFunction.d.ts.map