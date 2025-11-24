import type {SignalMetadata} from './types.js'
import {
	finalizeMemos,
	getMemberStat,
	getSignalsAndMemos,
	isPriorSignalOrMemoDefined,
	memoifyIfNeeded,
	sortSignalsMemosInMetadata,
} from '../signals/_state.js'

/**
 * A decorator that make a signal property derived from a memoized computation
 * based on other signals. Effects depending on this property will re-run when
 * the computed value changes, but not if the computed value stays the same even
 * if the dependencies changed.
 *
 * @example
 * ```ts
 * import {reactive, signal, memo} from "classy-solid";
 *
 * @reactive
 * class Example {
 *   @signal a = 1
 *   @signal b = 2
 *
 *   // @memo can be used on a field, getter, or accessor.
 *
 *   // Writable memo via field (requires function to have a parameter (arity > 0))
 *   @memo sum = (v?: number) => this.a + this.b
 *
 *   // Readonly memo via getter only
 *   @memo get sum2() {
 *     return this.a + this.b
 *   }
 *
 *   // Readonly memo via accessor (requires arrow function, not writable because no parameter (arity = 0))
 *   @memo accessor sum3 = () => this.a + this.b
 *
 *   // Readonly memo via method
 *   @memo sum4() {
 *     return this.a + this.b
 *   }
 *
 *   // Writable memo via getter with setter
 *   @memo get sum5() {
 *     return this.a + this.b
 *   }
 *   @memo set sum5(value: number) {
 *     // empty setter makes it writable (logic in here will be ignored if any)
 *   }
 *
 *   // The following variants are not supported yet as no runtime or TS support exists yet for the syntax.
 *
 *   // Writable memo via accessor, alternative long-hand syntax (not yet released, no runtime or TS support yet)
 *   @memo accessor sum6 { get; set } = () => this.a + this.b
 *
 *   // Readonly memo via accessor with only getter (not released yet, no runtime or TS support yet)
 *   @memo accessor sum7 { get; } = () => this.a + this.b
 *
 *   // Readonly memo via accessor with only getter, alternative syntax (not released yet, no runtime or TS support yet)
 *   @memo accessor sum8 {
 *     get() {
 *       return this.a + this.b
 *     }
 *   }
 *
 *   // Readonly memo via accessor with only getter, alternative syntax (not released yet, no runtime or TS support yet)
 *   @memo accessor sum8 {
 *     get() {
 *       return this.a + this.b
 *     }
 *     set(_v: number) {
 *       // empty setter makes it writable (logic in here will be ignored if any)
 *     }
 *   }
 * }
 *
 * const ex = new Example();
 *
 * console.log(ex.sum(), ex.sum2, ex.sum3(), ex.sum4(), ex.sum5);  // 3 3 3 3 3
 *
 * createEffect(() => {
 *   console.log(ex.sum(), ex.sum2, ex.sum3(), ex.sum4(), ex.sum5);
 * });
 *
 * ex.a = 5; // Logs: 7 7 7 7 7
 *
 * // This won't log anything since the computed memo values don't change (all still 7).
 * batch(() => {
 *   ex.a = 3;
 *   ex.b = 4;
 * })
 *
 * ex.sum(20); // Logs: 20 7 7 7 7 (only sum is updated)
 *
 * ex.sum5 = 15; // Logs: 20 7 7 7 15 (only sum5 is updated)
 *
 * ex.sum2 = 10; // Runtime error: Cannot set readonly property "sum2".
 * ```
 */
export function memo(
	_value:
		| undefined
		| ((val?: any) => any) // writable memo via field or method
		| (() => any) // readonly memo via field or method
		| ((val?: any) => void) // memo setter
		| (() => void) // memo getter
		| ClassAccessorDecoratorTarget<unknown, () => any> // today's auto-accessors, readonly memo
		| ClassAccessorDecoratorTarget<unknown, (val?: number) => any>, // today's auto-accessors, writable memo
	context:
		| ClassFieldDecoratorContext
		| ClassGetterDecoratorContext
		| ClassSetterDecoratorContext
		| ClassAccessorDecoratorContext
		| ClassMethodDecoratorContext,
) {
	if (context.static) throw new Error('@memo is not supported on static fields yet.')

	const {kind, name} = context
	const metadata = context.metadata as SignalMetadata
	const signalsAndMemos = getSignalsAndMemos(metadata)

	if (kind === 'field') {
		const stat = getMemberStat(name, 'memo-field', signalsAndMemos)

		context.addInitializer(function () {
			sortSignalsMemosInMetadata(metadata)
			memoifyIfNeeded(this as object, name, stat)

			// If we skipped memoifying prior memo members (accessor and method
			// memos) because of prior signal-fields, memo-fields, or
			// memo-auto-accessors, finalize those memos now.
			finalizeMemos(this as object, stat, signalsAndMemos)
		})
	} else if (kind === 'accessor') {
		const stat = getMemberStat(name, 'memo-auto-accessor', signalsAndMemos)

		context.addInitializer(function () {
			sortSignalsMemosInMetadata(metadata)
			memoifyIfNeeded(this as object, name, stat, true)

			// If we skipped memoifying prior memo members (accessor and method
			// memos) because of prior signal-fields, memo-fields, or
			// memo-auto-accessors, finalize those memos now.
			finalizeMemos(this as object, stat, signalsAndMemos)
		})
	} else if (kind === 'method') {
		const stat = getMemberStat(name, 'memo-method', signalsAndMemos)

		context.addInitializer(function () {
			sortSignalsMemosInMetadata(metadata)

			// If any signal-fields, memo-fields, or memo-auto-accessors are
			// defined on the class (thus sorted before this memo method), skip
			// memoifying now because we need those to be initialized first,
			// then we'll memoify after that.
			if (isPriorSignalOrMemoDefined(this as object, name, signalsAndMemos)) return

			memoifyIfNeeded(this as object, name, stat)
		})
	} else if (kind === 'getter' || kind === 'setter') {
		const stat = getMemberStat(name, 'memo-accessor', signalsAndMemos)

		context.addInitializer(function () {
			sortSignalsMemosInMetadata(metadata)

			// If any signal-fields, memo-fields, or memo-auto-accessors are
			// defined on the class (thus sorted before this memo method), skip
			// memoifying now because we need those to be initialized first,
			// then we'll memoify after that.
			if (isPriorSignalOrMemoDefined(this as object, name, signalsAndMemos)) return

			memoifyIfNeeded(this as object, name, stat)
		})
	}
}
