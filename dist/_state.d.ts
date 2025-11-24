import type { PropKey, SignalMetadata, SignalOrMemoType } from './decorators/types.js';
export declare const isSignalGetter: WeakSet<Function>;
export declare const isMemoGetter: WeakSet<Function>;
export declare function getSignalsAndMemos(metadata: SignalMetadata): [key: PropKey, stat: {
    type: SignalOrMemoType;
    applied: WeakMap<object, boolean>;
}][];
/**
 * Sort certain members tracked in metadata in the order of
 *
 * 1. signal fields
 * 2. memo fields
 * 3. memo auto-accessors
 * 4. memo accessors
 * 5. memo methods
 *
 * so that any members that are normally initialized *after*
 * getters/setters/methods (fields and accessors, such as signal fields, and
 * memo fields and auto-accessors) will be initialized before
 * getters/setters/methods (memo accessors and methods).
 *
 * This ensures proper initialization order which we cannot currently achieve
 * with the default ordering of EcmaScript decorators alone.
 */
export declare function sortSignalsMemosInMetadata(metadata: SignalMetadata): void;
export declare function getMemberStat(name: PropKey, type: SignalOrMemoType, signalsAndMemos: any[]): any;
export declare function memoifyIfNeeded(obj: object, name: PropKey, stat: any, isAutoAccessor?: boolean): void;
/**
 * If any signal-fields, memo-fields, or memo-auto-accessors are defined on the
 * class (thus sorted before the given memo field), skip memoifying now (true
 * return). We'll memoify later after signal fields are initialized.
 */
export declare function isPriorSignalOrMemoDefined(obj: object, name: PropKey, signalsAndMemos: any[]): boolean;
/**
 * This finalizes memo initialization for memo accessors and methods that
 * were waiting for all signal fields, memo fields, and memo auto-accessors
 * to be initialized first.
 *
 * Basically we ensure that memo initialization happens in this order:
 * 1. signal fields
 * 2. memo fields
 * 3. memo auto-accessors
 * 4. memo accessors
 * 5. memo methods
 *
 * This is important because memos may depend on signals or other memos, and we
 * cannot rely on EcmaScript decorator application order alone, since accessor
 * and method before field decorators no matter the order in source code.
 *
 * See: https://github.com/tc39/proposal-decorators/issues/566
 */
export declare function finalizeMemos(obj: object, stat: any, signalsAndMemos: any[]): void;
//# sourceMappingURL=_state.d.ts.map