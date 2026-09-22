import { getInheritedDescriptor } from 'lowclass/dist/getInheritedDescriptor.js';
import { signalify } from './signals/signalify.js';
import { Effects, isAnyEffectful } from './mixins/Effectful.js';
import { untrack } from 'solid-js';

/** Libraries that wrap classy-solid signal accessors should add their overriding getters to this set. */
export const isSignalGetter__ = new WeakSet();
/** Libraries that wrap classy-solid memo accessors should add their overriding getters to this set. */
export const isMemoGetter__ = new WeakSet();
export function getMembers__(metadata) {
  if (!Object.hasOwn(metadata, 'classySolid_members')) metadata.classySolid_members = []; // we don't extend the array from parent classes
  return metadata.classySolid_members;
}
export function getMemberStat__(name, type, members, context) {
  const index = members.findIndex(member => member.name === name);
  const existingStat = members[index];
  const newStat = {
    type,
    name,
    applied: new WeakMap(),
    finalize: () => {},
    context
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
export function signalifyIfNeeded__(obj, stat) {
  const {
    name
  } = stat;
  if (stat.applied.get(obj)) throw new Error(`@signal decorated member "${String(name)}" has already been signalified. This can happen if there are duplicated class members.`);
  if (!stat.reuseExistingSignal) signalify(obj, [name, untrack(() => obj[name])]);
  stat.applied.set(obj, true);
}

/** @private internal state */
export const effects__ = new WeakMap();
/**
 * Get (creating on first call) the `Effects` instance that owns all `@effect`
 * and `@memo` members of `obj`, as well as any `memoify()`'d members. If `obj`
 * is itself `Effectful`, `obj` is used directly so that decorator members,
 * `memoify()` members, and manual `this.createEffect()`/`this.createMemo()`
 * calls all share one root and one `stopEffects()`/`startEffects()`.
 *
 * The instance is put in the class's initial start state (`static
 * autoStartEffects`) on creation, regardless of which decorator reaches it
 * first (memos finalize before effects in `customSortOrder`).
 */
export function getEffects__(obj) {
  let effects = effects__.get(obj);
  if (effects) return effects;
  effects__.set(obj, effects = isAnyEffectful(obj) ? obj : new Effects());
  const ctor = obj.constructor;
  if (ctor.autoStartEffects === false) effects.stopEffects();
  return effects;
}

/**
 * Per-instance record of which classes' decorated members have been
 * finalized (all `finalize()` callbacks run). `@memo` reads check this so a
 * memo is never created before its class's signals are signalified.
 */
const finalized__ = new WeakMap();

/** @private internal */
export function isFinalized__(obj, members) {
  return !!finalized__.get(obj)?.has(members);
}
export function effectifyIfNeeded__(obj, stat) {
  const {
    name,
    context
  } = stat;
  if (stat.applied.get(obj)) throw new Error(`@effect decorated member "${String(name)}" has already been effectified. This can happen if there are duplicated class members.`);
  if (context.kind !== 'method' && context.kind !== 'accessor') throw new Error('not possible');
  const decoratedMember = stat.value;
  if (!decoratedMember) throw new Error('not possible');

  // In case of private members, there is no inheritance, so the decorated value is the member itself.
  const privateMember = context.private && decoratedMember;

  // Get any overriding/extending member from the prototype chain.
  const leafmostMember = privateMember ? privateMember : stat.type === 'effect-auto-accessor' ? getInheritedDescriptor(obj, name).get // auto-accessor getter is the member (not the value)
  : obj[name]; // method is both value and member

  // Skip base class effectify if a subclass is overriding an effect.
  if (leafmostMember !== decoratedMember) return;
  const effectFn = context.access.get(obj);
  if (typeof effectFn !== 'function') throw new Error(`@effect decorated member "${String(name)}" is not a function: ${effectFn}`);
  const effects = getEffects__(obj);
  const ctor = obj.constructor;
  const autoStart = ctor.autoStartEffects === undefined || ctor.autoStartEffects;

  // getEffects__ already put the instance in the stopped state when
  // autoStart is false; here we only add the effect fn without starting it.
  if (autoStart) effects.createEffect(() => effectFn.call(obj));else effects.addEffectFn(() => effectFn.call(obj));
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
export function finalizeMembersIfLast__(obj, members) {
  let count = extraInitializersCount.get(obj) ?? 0;
  extraInitializersCount.set(obj, ++count);

  // If this is not the last extra initializer called, return.
  if (count !== members.length) return;
  extraInitializersCount.set(obj, 0);

  // The last member in EcmaScript decorator extra initializer application
  // order has been initialized, so we can now initialize all the members we
  // track in our custom order: signal fields first, then memos, then effects.
  sortMetadataMembersCustomOrder(members);
  let i = 0;
  for (; i < members.length && members[i].type === 'signal-field'; i++) members[i].finalize?.call(obj);

  // All @signal fields of this class are now signalified, which is what @memo
  // reads require (a memo created before that would track nothing). Mark this
  // class finalized for `obj` BEFORE running memo and effect finalizers:
  // effects are eager and commonly read memos during their first run.
  let finalizedMembers = finalized__.get(obj);
  if (!finalizedMembers) finalized__.set(obj, finalizedMembers = new WeakSet());
  finalizedMembers.add(members);
  for (; i < members.length; i++) members[i].finalize?.call(obj);
}
//# sourceMappingURL=_state.js.map