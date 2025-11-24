import type {Constructor} from 'lowclass/dist/Constructor.js'
import type {SignalFunction} from '../signals/createSignalFunction.js'

export type DecoratedValue = Constructor | Function | ClassAccessorDecoratorTarget<object, unknown> | undefined

export type PropKey = string | symbol

export type SupportedKind = 'field' | 'getter' | 'setter'

// If we add options for `@signal` later (f.e. `@signal({equals: false})`),
// those options can go in here too.
export interface PropSpec {
	initialValue: unknown
	kind: SupportedKind
}

export type SignalOrMemoType = 'signal-field' | 'memo-field' | 'memo-accessor' | 'memo-auto-accessor' | 'memo-method'

export type SignalMetadata = {
	signalFieldsAndMemos?: Array<[key: PropKey, stat: {type: SignalOrMemoType; applied: WeakMap<object, boolean>}]>

	getterSetterSignals?: Record<PropKey, WeakMap<object, SignalFunction<unknown>> | undefined>

	getterSetterPairCounts: {[key: PropKey]: 0 | 1 | 2}
}
