import type {Constructor} from 'lowclass/dist/Constructor.js'
import type {SignalFunction} from '../signals/createSignalFunction.js'
import type {Accessor, Setter} from 'solid-js'

export type AnyObject = Record<PropertyKey, unknown>

export type DecoratedValue = Constructor | Function | ClassAccessorDecoratorTarget<object, unknown> | undefined

export type PropKey = string | symbol

export type SupportedKind = 'field' | 'getter' | 'setter'

// If we add options for `@signal` later (f.e. `@signal({equals: false})`),
// those options can go in here too.
export interface PropSpec {
	initialValue: unknown
	kind: SupportedKind
}

export type MemberType =
	| 'signal-field'
	| 'memo-auto-accessor'
	| 'memo-accessor'
	| 'memo-method'
	| 'effect-auto-accessor'
	| 'effect-method'

export type MetadataMembers = Array<MemberStat>

export type MemberStat = {
	type: MemberType
	name: PropKey
	applied: WeakMap<object, boolean>
	finalize?(this: AnyObject): void
	/**
	 *
	 */
	value?: unknown
	context: ClassMemberDecoratorContext
	/**
	 * For signal fields, indicates whether an existing signal descriptor should
	 * be restored instead of initializing a new one. This is used to support
	 * overridden initial values in subclasses, while keeping base class effects
	 * and memos working.
	 */
	reuseExistingSignal?: boolean
	/**
	 * For signal fields, a subclass override's initial value to set into an
	 * existing signal from a base class.
	 */
	newInitialValue?: unknown
	/** For signal fields, the existing signal descriptor to restore in a subclass override. */
	existingSignalDescriptor?: PropertyDescriptor
}

export type ClassySolidMetadata = {
	__proto__: ClassySolidMetadata
	classySolid_members?: MetadataMembers
	classySolid_getterSetterSignals?: Record<PropKey, WeakMap<object, SignalFunction<unknown>> | undefined>
	classySolid_getterSetterPairCounts?: {[key: PropKey]: 0 | 1 | 2}
	classySolid_memos?: Record<PropKey, MemoRecord | undefined>
}

/** The stable per-instance accessor pair produced for a `@memo` member. */
export type MemoAccessors = readonly [get: Accessor<unknown>, set?: Setter<unknown>]

/**
 * Per-class, per-member state for `@memo`. Shared by a getter and its setter
 * (the setter marks the record writable); owned per class via
 * `Object.hasOwn(metadata, …)` so a subclass override gets its own record
 * and base + sub memos coexist per instance for `super.x` extension.
 */
export type MemoRecord = {
	/** Set by a `@memo` setter decorator; for methods/accessors decided by fn arity. */
	writable: boolean
	/** The stable accessors for each instance, created on first read. */
	storage: WeakMap<object, MemoAccessors>
	/** For getters and methods: the decorated function (stored at decoration time). */
	memoFn?: (this: unknown) => unknown
	/** For auto-accessors: the function value each instance was initialized with. */
	accessorFns?: WeakMap<object, Function>
}
