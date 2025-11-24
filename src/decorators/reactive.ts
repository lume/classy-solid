import type {AnyConstructor} from 'lowclass/dist/Constructor.js'
import {untracked} from './untracked.js'

/**
 * @deprecated This is no longer needed for making signal fields work. The
 * only other use case was to make the constructor untracked.Use the new
 * `@untracked` decorator instead. This is now an alias for `@untracked`.
 */
export function reactive(value: AnyConstructor, context: ClassDecoratorContext | undefined): any {
	return untracked(value, context)
}
