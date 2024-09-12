import type {Constructor} from 'lowclass/dist/Constructor.js'

export type DecoratedValue = Constructor | Function | ClassAccessorDecoratorTarget<object, unknown> | undefined

export type PropKey = string | symbol

// If we add options for `@signal` later (f.e. `@signal({equals: false})`),
// those options can go in here too.
export interface PropSpec {
	initialValue: unknown
}
