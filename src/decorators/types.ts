import type {Constructor} from 'lowclass'

export interface DecoratorContext {
	kind: 'class' | 'method' | 'getter' | 'setter' | 'field' | 'accessor'
	name: string | symbol
	access: Access
	private?: boolean
	static?: boolean
	addInitializer?(initializer: () => void): void
}

export interface Access {
	get?(): unknown
	set?(value: unknown): void
}

export interface Accessor {
	get(): unknown
	set(value: unknown): void
}

export type DecoratedValue = Constructor | Function | Accessor | undefined

export type DecoratorArgs = [DecoratedValue, DecoratorContext]

export type PropKey = string | symbol

// If we add options for `@signal` later (f.e. `@signal({equals: false})`),
// those options can go in here too.
export interface PropSpec {
	initialValue: unknown
}
