export declare function signalify<T extends object>(obj: T, ...props: (keyof T)[]): T;
export declare function signalify<T extends object, K extends keyof T>(obj: T): T;
export declare function getCreateSignalAccessor(): typeof createSignalAccessor;
export declare function __isPropSetAtLeastOnce(instance: object, prop: string | symbol): boolean;
declare function createSignalAccessor<T extends object>(obj: T, prop: Exclude<keyof T, number>, initialVal?: unknown, override?: boolean): void;
export {};
//# sourceMappingURL=signalify.d.ts.map