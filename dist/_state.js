import { memoify, setMemoifyMemberStat } from './signals/memoify.js';
import { getInheritedDescriptor } from 'lowclass/dist/getInheritedDescriptor.js';
import { signalify } from './signals/signalify.js';
import { Effects } from './mixins/Effectful.js';
export const isSignalGetter = new WeakSet();
export const isMemoGetter = new WeakSet();
export function getMembers(metadata) {
  if (!Object.hasOwn(metadata, 'classySolid_members')) metadata.classySolid_members = []; // we don't extend the array from parent classes
  return metadata.classySolid_members;
}
export function getMemberStat(name, type, members) {
  const index = members.findIndex(member => member.name === name);
  const existingStat = members[index];
  const newStat = {
    type,
    name,
    applied: new WeakMap(),
    finalize: () => {}
  };

  // replace stat in the array with the latest (f.e. duplicate class members, last one wins)
  if (existingStat) members[index] = newStat;else members.push(newStat);
  return newStat;
}
const isSortedCustom = new WeakSet();

// This is the order we want for initializing supported types of members.
const customSortOrder = {
  'signal-field': 0,
  'memo-auto-accessor': 1,
  'memo-accessor': 1,
  'memo-method': 1,
  'effect-auto-accessor': 2,
  'effect-method': 2
};

// This is the EcmaScript decorator extra initializer application order we don't want, for reference.
// Anything in the same group is applied in source order within that group.
// const ecmascriptSortOrder: Record<SignalOrMemoType, number> = {
// 	'memo-method': 0,
// 	'memo-accessor': 0,
// 	'effect-method': 0,
// 	'signal-field': 1,
// 	'memo-auto-accessor': 1,
// 	'effect-auto-accessor': 1,
// }

/**
 * Sort signal, memo, and effect members tracked in metadata in the order of
 * our custom `memberSortOrder`.
 *
 * This is so that any members that are normally initialized *after*
 * getters/setters/methods (such as signal fields, and memo fields and
 * auto-accessors) will be initialized before getters/setters/methods (memo
 * accessors and methods), otherwise they will be initialize *after*
 * getters/setters/methods due to EcmaScript decorator application order rules.
 *
 * See: https://github.com/tc39/proposal-decorators/issues/566
 */
function sortMetadataMembersCustomOrder(members) {
  // Avoid sorting multiple times (that's why this is called in class
  // initializers rather than in the decorator directly).
  if (isSortedCustom.has(members)) return;
  isSortedCustom.add(members);

  // Sort so that signal fields come first, then memo fields and
  // auto-accessors, finally memo accessors and methods.
  members.sort((a, b) => customSortOrder[a.type] - customSortOrder[b.type]);
}
export function signalifyIfNeeded(obj, name, stat) {
  if (stat.applied.get(obj)) throw new Error(`@signal decorated member "${String(name)}" has already been signalified. This can happen if there are duplicated class members.`);
  signalify(obj, [name, /*untrack*/() => obj[name]]); // untrack in case obj[name] is already a signal (f.e. from a Solid Proxy)

  stat.applied.set(obj, true);
}
export function memoifyIfNeeded(obj, name, stat) {
  if (stat.applied.get(obj)) throw new Error(`@memo decorated member "${String(name)}" has already been memoified. This can happen if there are duplicated class members.`);
  setMemoifyMemberStat(stat);
  memoify(obj, name);
  stat.applied.set(obj, true);
}

/** @private internal state */
export const effects__ = new WeakMap();
export function effectifyIfNeeded(obj, name, stat) {
  if (stat.applied.get(obj)) throw new Error(`@effect decorated member "${String(name)}" has already been effectified. This can happen if there are duplicated class members.`);
  const decoratorValue = stat.value;
  if (!decoratorValue) throw new Error('not possible');
  const descriptor = getInheritedDescriptor(obj, name);
  const leafmostMemberValue = stat.type === 'effect-auto-accessor' ? descriptor.get : obj[name];

  // Skip base class effectify if a subclass is overriding an effect.
  if (leafmostMemberValue !== decoratorValue) return;
  const fn = obj[name];
  if (typeof fn !== 'function') throw new Error(`@effect decorated member "${String(name)}" is not a function: ${fn}`);
  let effects = effects__.get(obj);
  if (!effects) {
    // If the object is already an Effects instance, use it directly.
    if (obj instanceof Effects) effects__.set(obj, effects = obj);
    // Otherwise, create a new Effects instance to manage the effects.
    else effects__.set(obj, effects = new Effects());
  }
  effects.createEffect(() => fn.call(obj));
  stat.applied.set(obj, true);
}

/**
 * Count number of extra initializers called for the given members array
 * per instance, so we know when the last one is called, to finalize all
 * members.
 */
const extraInitializersCount = new WeakMap();

/**
 * This finalizes memo initialization for the members tracked, in our custom
 * ordering.
 *
 * This is important because memos may depend on signals or other memos, and we
 * cannot rely on EcmaScript decorator order, or extra initializer order alone,
 * because accessor and method decorators/initializers run before field
 * decorators no matter the order in source code (give or take some details
 * regarding auto accessor ordering).
 *
 * See: https://github.com/tc39/proposal-decorators/issues/566
 */
export function finalizeMembersIfLast(obj, members) {
  let count = extraInitializersCount.get(obj) ?? 0;
  extraInitializersCount.set(obj, ++count);

  // If this is not the last extra initializer called, return.
  if (count !== members.length) return;
  extraInitializersCount.set(obj, 0);

  // The last member in EcmaScript decorator extra initializer application
  // order has been initialized, so we can now initialize all the members we
  // track in our custom order.
  sortMetadataMembersCustomOrder(members);

  // All signal-fields, memo-fields, and memo-auto-accessors have been
  // initialized. Now initialize memo fields that were waiting for
  // those to be ready.
  for (const stat of members) stat.finalize?.call(obj);
}
//# sourceMappingURL=_state.js.map