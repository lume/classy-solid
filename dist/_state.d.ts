import type { AnyObject, MemberStat, MetadataMembers, PropKey, ClassySolidMetadata, MemberType } from './decorators/types.js';
import { Effects } from './mixins/Effectful.js';
/** Libraries that wrap classy-solid signal accessors should add their overriding getters to this set. */
export declare const isSignalGetter__: WeakSet<Function>;
/** Libraries that wrap classy-solid memo accessors should add their overriding getters to this set. */
export declare const isMemoGetter__: WeakSet<Function>;
export declare function getMembers__(metadata: ClassySolidMetadata): MetadataMembers;
export declare function getMemberStat__(name: PropKey, type: MemberType, members: MetadataMembers, context: ClassMemberDecoratorContext): MemberStat;
export declare function signalifyIfNeeded__(obj: AnyObject, stat: MemberStat): void;
export declare function memoifyIfNeeded__(obj: AnyObject, stat: MemberStat): void;
/** @private internal state */
export declare const effects__: WeakMap<AnyObject, Effects>;
export type AutoStartable = {
    autoStartEffects?: boolean;
};
export declare function effectifyIfNeeded__(obj: AnyObject, stat: MemberStat): void;
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
export declare function finalizeMembersIfLast__(obj: AnyObject, members: MetadataMembers): void;
//# sourceMappingURL=_state.d.ts.map