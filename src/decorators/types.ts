import type {Constructor} from 'lowclass/dist/Constructor.js'
import type {SignalFunction} from '../signals/createSignalFunction.js'

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

export type SignalOrMemoType =
	| 'signal-field'
	| 'memo-auto-accessor'
	| 'memo-accessor'
	| 'memo-method'
	| 'effect-auto-accessor'
	| 'effect-method'

export type MetadataMembers = Array<MemberStat>

export type MemberStat = {
	type: SignalOrMemoType
	name: PropKey
	applied: WeakMap<object, boolean>
	finalize?(this: AnyObject): void
	value?: unknown
}

export type ClassySolidMetadata = {
	__proto__: ClassySolidMetadata
	classySolid_members?: MetadataMembers
	classySolid_getterSetterSignals?: Record<PropKey, WeakMap<object, SignalFunction<unknown>> | undefined>
	classySolid_getterSetterPairCounts?: {[key: PropKey]: 0 | 1 | 2}
}
