import {batch} from 'solid-js'
import {getSignal__, trackPropSetAtLeastOnce__} from '../signals/signalify.js'
import type {AnyObject, ClassySolidMetadata} from './types.js'
import type {SignalFunction} from '../signals/createSignalFunction.js'
import {isSignalGetter, getMemberStat, finalizeMembersIfLast, getMembers, signalifyIfNeeded} from '../_state.js'
import './metadata-shim.js'

const Undefined = Symbol()

/**
 * @decorator
 * Decorate properties of a class with `@signal` to back them with Solid
 * signals, making them reactive.
 *
 * Related: See the Solid.js `createSignal` API for creating standalone signals.
 *
 * Example:
 *
 * ```js
 * import {signal} from 'classy-solid'
 * import {createEffect} from 'solid-js'
 *
 * class Counter {
 *   ⁣@signal count = 0
 *
 *   constructor() {
 *     setInterval(() => this.count++, 1000)
 *   }
 * }
 *
 * const counter = new Counter()
 *
 * createEffect(() => {
 *   console.log('count:', counter.count)
 * })
 * ```
 */
export function signal(
	value: unknown,
	context:
		| ClassFieldDecoratorContext
		| ClassGetterDecoratorContext
		| ClassSetterDecoratorContext
		| ClassAccessorDecoratorContext,
): any {
	if (context.static) throw new Error('@signal is not supported on static fields yet.')

	const {kind, name} = context
	const metadata = context.metadata as ClassySolidMetadata
	const signalsAndMemos = getMembers(metadata)

	if (!(kind === 'field' || kind === 'accessor' || kind === 'getter' || kind === 'setter'))
		throw new InvalidSignalDecoratorError()

	if (kind === 'field') {
		const stat = getMemberStat(name, 'signal-field', signalsAndMemos)

		stat.finalize = function (this: unknown) {
			signalifyIfNeeded(this as AnyObject, name, stat)
		}

		context.addInitializer(function () {
			finalizeMembersIfLast(this as AnyObject, signalsAndMemos)
		})
	}

	// It's ok that getters/setters/auto-accessors are not finalized the same
	// way as with fields above and as with memos/effects, because we do the set
	// up during decoration which happens well before any initializers (before
	// any memos and effects, so these will be tracked).
	else if (kind === 'accessor') {
		const {get, set} = value as {get: () => unknown; set: (v: unknown) => void}
		const signalStorage = new WeakMap<object, SignalFunction<unknown>>()
		let initialValue: unknown = undefined

		const newValue = {
			init: function (this: object, initialVal: unknown) {
				initialValue = initialVal
				return initialVal
			},
			get: function (this: object): unknown {
				getSignal__(this, signalStorage, initialValue)()
				return get.call(this)
			},
			set: function (this: object, newValue: unknown) {
				// batch, for example in case setter calls super setter, to
				// avoid multiple effect runs on a single property set.
				batch(() => {
					set.call(this, newValue)
					trackPropSetAtLeastOnce__(this, name) // not needed anymore? test it

					const s = getSignal__(this, signalStorage, initialValue)
					s(typeof newValue === 'function' ? () => newValue : newValue)
				})
			},
		}

		isSignalGetter.add(newValue.get)

		return newValue
	} else if (kind === 'getter' || kind === 'setter') {
		const getOrSet = value as Function
		const initialValue = Undefined

		if (!Object.hasOwn(metadata, 'classySolid_getterSetterSignals')) metadata.classySolid_getterSetterSignals = {}
		const signalsStorages = metadata.classySolid_getterSetterSignals!

		let signalStorage = signalsStorages[name]
		if (!signalStorage) signalsStorages[name] = signalStorage = new WeakMap<object, SignalFunction<unknown>>()

		if (!Object.hasOwn(metadata, 'classySolid_getterSetterPairCounts')) metadata.classySolid_getterSetterPairCounts = {}
		const pairs = metadata.classySolid_getterSetterPairCounts!

		// Show a helpful error in case someone forgets to decorate both a getter and setter.
		queueMicrotask(() => {
			queueMicrotask(() => delete metadata.classySolid_getterSetterPairCounts)
			const missing = pairs[name] !== 2
			if (missing) throw new MissingSignalDecoratorError(name)
		})

		if (kind === 'getter') {
			pairs[name] ??= 0
			pairs[name]++

			const newGetter = function (this: object): unknown {
				getSignal__(this, signalStorage, initialValue)()
				return getOrSet.call(this)
			}

			isSignalGetter.add(newGetter)

			return newGetter
		} else {
			pairs[name] ??= 0
			pairs[name]++

			const newSetter = function (this: object, newValue: unknown) {
				// batch, for example in case setter calls super setter, to
				// avoid multiple effect runs on a single property set.
				batch(() => {
					getOrSet.call(this, newValue)
					trackPropSetAtLeastOnce__(this, name)

					const s = getSignal__(this, signalStorage, initialValue)
					s(typeof newValue === 'function' ? () => newValue : newValue)
				})
			}

			return newSetter
		}
	}
}

class MissingSignalDecoratorError extends Error {
	constructor(prop: PropertyKey) {
		super(
			`Missing @signal decorator on setter or getter for property "${String(
				prop,
			)}". The @signal decorator will only work on a getter/setter pair with *both* getter and setter decorated with @signal.`,
		)
	}
}

class InvalidSignalDecoratorError extends Error {
	constructor() {
		super('The @signal decorator is only for use on fields, getters, setters, and auto accessors.')
	}
}
