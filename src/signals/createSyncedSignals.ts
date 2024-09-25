import {createSignal} from 'solid-js'
import {syncSignals} from './syncSignals.js'

/**
 * Useful as a shorthand for:
 *
 * ```js
 * const [[foo, setFoo], [bar, setBar]] = syncSignals(...createSignal(0), ...createSignal(0))
 * ```
 *
 * Example:
 *
 * ```js
 * const [[foo, setFoo], [bar, setBar]] = createSyncedSignals(0)
 * ```
 */
export function createSyncedSignals<T>(initialValue: T) {
	return syncSignals(
		...(createSignal(initialValue) as [() => T, (v: T) => void]),
		...(createSignal(initialValue) as [() => T, (v: T) => void]),
	)
}
