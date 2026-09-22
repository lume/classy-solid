import type { AnyObject, MemberStat, MetadataMembers, PropKey, ClassySolidMetadata, MemberType } from './decorators/types.js';
import { type AnyEffectful } from './mixins/Effectful.js';
/** Libraries that wrap classy-solid signal accessors should add their overriding getters to this set. */
export declare const isSignalGetter__: WeakSet<Function>;
/** Libraries that wrap classy-solid memo accessors should add their overriding getters to this set. */
export declare const isMemoGetter__: WeakSet<Function>;
export declare function getMembers__(metadata: ClassySolidMetadata): MetadataMembers;
export declare function getMemberStat__(name: PropKey, type: MemberType, members: MetadataMembers, context: ClassMemberDecoratorContext): MemberStat;
export declare function signalifyIfNeeded__(obj: AnyObject, stat: MemberStat): void;
/** @private internal state */
export declare const effects__: WeakMap<AnyObject, {
    "__#1@#effectFunctions": (() => void)[];
    "__#1@#started": boolean;
    createEffect(fn: () => void): void;
    addEffectFn(fn: () => void): void;
    "__#1@#isRestarting": boolean;
    startEffects(): void;
    stopEffects(): void;
    clearEffects(): void;
    "__#1@#parentOwner": import("solid-js").Owner | null;
    "__#1@#dispose": () => void;
    "__#1@#owner": import("solid-js").Owner;
    "__#1@#createEffect"(fn: () => void): void;
    "__#1@#memoVersion": import("solid-js").Signal<number>;
    createMemo<T>(fn: (prev: T | undefined) => T, value?: T | undefined, options?: import("solid-js").MemoOptions<T> | undefined): import("solid-js").Accessor<T>;
    createWritableMemo<T>(fn: (prev: T | undefined) => T, value?: T | undefined, options?: import("solid-js").MemoOptions<T> | undefined): [get: import("solid-js").Accessor<T>, set: import("solid-js").Setter<T>];
    "__#1@#memo"<T>(fn: (prev: T | undefined) => T, value: T | undefined, options: import("./index.js").LazyMemoOptions<T>): readonly [get: import("solid-js").Accessor<T>, set?: import("solid-js").Setter<T> | undefined];
    "__#1@#lazyMemo"<T>(fn: (prev: T | undefined) => T, value: T | undefined, options: import("./index.js").LazyMemoOptions<T>): readonly [get: import("solid-js").Accessor<T>, set?: import("solid-js").Setter<T> | undefined];
} & object>;
export type AutoStartable = {
    autoStartEffects?: boolean;
};
/**
 * Get (creating on first call) the `Effects` instance that owns all `@effect`
 * and `@memo` members of `obj`, as well as any `memoify()`'d members. If `obj`
 * is itself `Effectful`, `obj` is used directly so that decorator members,
 * `memoify()` members, and manual `this.createEffect()`/`this.createMemo()`
 * calls all share one root and one `stopEffects()`/`startEffects()`.
 *
 * The instance is put in the class's initial start state (`static
 * autoStartEffects`) on creation, regardless of which decorator reaches it
 * first (memos finalize before effects in `customSortOrder`).
 */
export declare function getEffects__(obj: AnyObject): AnyEffectful;
/** @private internal */
export declare function isFinalized__(obj: AnyObject, members: MetadataMembers): boolean;
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