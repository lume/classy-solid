import { memoify } from './signals/memoify.js';
export const isSignalGetter = new WeakSet();
export const isMemoGetter = new WeakSet();
const isSorted = new WeakSet();
const typeOrder = {
  'signal-field': 0,
  'memo-field': 1,
  'memo-auto-accessor': 1,
  'memo-accessor': 2,
  'memo-method': 2
};
export function getSignalsAndMemos(metadata) {
  if (!Object.hasOwn(metadata, 'signalFieldsAndMemos')) metadata.signalFieldsAndMemos = [];
  return metadata.signalFieldsAndMemos;
}

/**
 * Sort certain members tracked in metadata in the order of
 *
 * 1. signal fields
 * 2. memo fields
 * 3. memo auto-accessors
 * 4. memo accessors
 * 5. memo methods
 *
 * so that any members that are normally initialized *after*
 * getters/setters/methods (fields and accessors, such as signal fields, and
 * memo fields and auto-accessors) will be initialized before
 * getters/setters/methods (memo accessors and methods).
 *
 * This ensures proper initialization order which we cannot currently achieve
 * with the default ordering of EcmaScript decorators alone.
 */
export function sortSignalsMemosInMetadata(metadata) {
  if (!metadata.signalFieldsAndMemos) return;
  if (isSorted.has(metadata)) return;
  isSorted.add(metadata);

  // Sort so that signal fields come first, then memo fields and
  // auto-accessors, finally memo accessors and methods.
  metadata.signalFieldsAndMemos.sort((a, b) => typeOrder[a[1].type] - typeOrder[b[1].type]);
}
export function getMemberStat(name, type, signalsAndMemos) {
  let stat = signalsAndMemos.find(([key]) => key === name)?.[1];
  if (!stat) signalsAndMemos.push([name, stat = {
    type,
    applied: new WeakMap()
  }]);
  return stat;
}
export function memoifyIfNeeded(obj, name, stat, isAutoAccessor = false) {
  if (stat.applied.get(obj)) return;
  isAutoAccessor ? memoify(obj, true, name) : memoify(obj, name);
  stat.applied.set(obj, true);
}

/**
 * If any signal-fields, memo-fields, or memo-auto-accessors are defined on the
 * class (thus sorted before the given memo field), skip memoifying now (true
 * return). We'll memoify later after signal fields are initialized.
 */
export function isPriorSignalOrMemoDefined(obj, name, signalsAndMemos) {
  for (const [key, stat] of signalsAndMemos) {
    if ((stat.type === 'signal-field' || stat.type === 'memo-field' || stat.type === 'memo-auto-accessor') && !stat.applied.get(obj)) return true;
    if (key === name) break; // reached our own memo field, no prior signal-fields or memo-auto-accessors found
  }
  return false;
}

/**
 * This finalizes memo initialization for memo accessors and methods that
 * were waiting for all signal fields, memo fields, and memo auto-accessors
 * to be initialized first.
 *
 * Basically we ensure that memo initialization happens in this order:
 * 1. signal fields
 * 2. memo fields
 * 3. memo auto-accessors
 * 4. memo accessors
 * 5. memo methods
 *
 * This is important because memos may depend on signals or other memos, and we
 * cannot rely on EcmaScript decorator application order alone, since accessor
 * and method before field decorators no matter the order in source code.
 *
 * See: https://github.com/tc39/proposal-decorators/issues/566
 */
export function finalizeMemos(obj, stat, signalsAndMemos) {
  const last = signalsAndMemos.findLast(([_, {
    type
  }]) => type === 'signal-field' || type === 'memo-field' || type === 'memo-auto-accessor');
  const [, lastStat] = last;
  if (stat !== lastStat) return;

  // All signal-fields, memo-fields, and memo-auto-accessors have been
  // initialized. Now initialize memo fields that were waiting for
  // those to be ready.
  for (const [key, stat] of signalsAndMemos) {
    if (!(stat.type === 'memo-accessor' || stat.type === 'memo-method') || stat.applied.get(obj)) continue;
    memoifyIfNeeded(obj, key, stat);
  }
}
//# sourceMappingURL=_state.js.map