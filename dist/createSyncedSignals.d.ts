/**
 * Useful as a shorthand for:
 *
 * ```js
 * const [[foo, setFoo], [bar, setBar]] = syncSignals(...createSignal(0), ...createSignal(0))
 * ```
 *
 * Example:
 *
 * ```js
 * const [[foo, setFoo], [bar, setBar]] = createSyncedSignals(0)
 * ```
 */
export declare function createSyncedSignals<T>(initialValue: T): readonly [readonly [() => T, (value: T) => void], readonly [() => T, (value: T) => void]];
//# sourceMappingURL=createSyncedSignals.d.ts.map