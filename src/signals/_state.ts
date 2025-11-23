import type {SignalMetadata} from '../decorators/types.js'

export const isSignalGetter = new WeakSet<Function>()
export const isMemoGetter = new WeakSet<Function>()

const isSorted = new WeakSet<SignalMetadata>()

const typeOrder = {'signal-field': 0, 'memo-field': 1, 'memo-auto-accessor': 1, 'memo-accessor': 2, 'memo-method': 2}

export function __sortSignalsMemosInMetadata(metadata: SignalMetadata) {
	if (!metadata.signalFieldsAndMemos) return

	if (isSorted.has(metadata)) return
	isSorted.add(metadata)

	// Sort so that signal fields come first, then memo fields and
	// auto-accessors, finally memo accessors and methods.
	metadata.signalFieldsAndMemos.sort((a, b) => typeOrder[a[1].type] - typeOrder[b[1].type])
}
