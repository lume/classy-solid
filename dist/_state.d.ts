import type { AnyObject, MemberStat, MetadataMembers, PropKey, ClassySolidMetadata, SignalOrMemoType } from './decorators/types.js';
import { Effects } from './mixins/Effectful.js';
export declare const isSignalGetter: WeakSet<Function>;
export declare const isMemoGetter: WeakSet<Function>;
export declare function getMembers(metadata: ClassySolidMetadata): MetadataMembers;
export declare function getMemberStat(name: PropKey, type: SignalOrMemoType, members: MetadataMembers): MemberStat;
export declare function signalifyIfNeeded(obj: AnyObject, name: PropKey, stat: MemberStat): void;
export declare function memoifyIfNeeded(obj: AnyObject, name: PropKey, stat: MemberStat): void;
/** @private internal state */
export declare const effects__: WeakMap<AnyObject, Effects>;
export declare function effectifyIfNeeded(obj: AnyObject, name: PropKey, stat: MemberStat): void;
/**
 * This finalizes memo initialization for the members tracked, in our custom
 * ordering.
 *
 * This is important because memos may depend on signals or other memos, and we
 * cannot rely on EcmaScript decorator order, or extra initializer order alone,
 * because accessor and method decorators/initializers run before field
 * decorators no matter the order in source code (give or take some details
 * regarding auto accessor ordering).
 *
 * See: https://github.com/tc39/proposal-decorators/issues/566
 */
export declare function finalizeMembersIfLast(obj: AnyObject, members: MetadataMembers): void;
//# sourceMappingURL=_state.d.ts.map