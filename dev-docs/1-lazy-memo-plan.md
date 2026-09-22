# Lazy, Effectful-owned Memos

Status: **Steps 1–6 ✅ implemented and verified** (build, typecheck, 168/168 tests green; baseline was 137). Step 7 (downstream Lume) pending. See §6 for what implementation taught us that the plan did not anticipate.

## 1. Problems with the current `@memo` implementation

### 1.1 Eager evaluation during field initialization

Solid's `createMemo` evaluates its computation immediately
(`solid-js/dist/dev.js:265` — `updateComputation(c)` is called synchronously
inside `createMemo`, not deferred to the first read).

For **public** members, `@memo` registers a member stat and, in the last extra
initializer, `finalizeMembersIfLast__` → `memoifyIfNeeded__` → `memoify()` →
`createMemo()`. Memos and effects are therefore created (and run) when the
**last `@signal` field** is initialized. Any regular field declared after that
point is still `undefined` when a memo body first runs:

```ts
class Foo {
	@signal a = 1
	runs = 0 // declared after the last @signal → undefined when the memo first runs

	@memo get doubled() {
		this.runs++ // NaN, then overwritten by `runs = 0`
		return this.a * 2
	}
}
```

This is a known, predictable ordering rule (see README → "Field Initialization
Order" and its two workarounds). But for memos specifically it also produces
**silently stale caches**: in Lume, `CompositionTracker.composedParent` first
ran during template construction while the element sat in a `DocumentFragment`,
cached `null`, and — because its only signal (`__composedParent`) never changes
for hosts that don't mix in `CompositionTracker` — never recomputed.
`isComposed` then cached `false`, `needsUpdate()` bailed, and `bit-mae.html`
rendered nothing with zero console errors.

The **private accessor** path (`memo.ts`, `kind === 'accessor'` → `init`) is
eager too: `createWritableMemo` runs in the auto-accessor's `init`.

### 1.2 Private getter/method memos are already "lazy" — but leak

`memo.ts:159` and `memo.ts:204` already create the memo on first access:

```ts
memos.set(self, (memo = createRoot(() => createWritableMemo(() => memoFn.call(this)))))
```

`createRoot` with a 0‑arity callback creates an **unowned** root
(`dev.js:176`: `unowned = fn.length === 0` → `owner: null`), and the `dispose`
is never captured. Those memos can never be cleaned up. If the memo reads
external state (a global store, a parent's signal), the store's `observers`
array holds the memo → the memo's closure holds the instance → the instance
leaks for the lifetime of the store. Simply swapping `createWritableMemo` for a
lazy variant inside that `createRoot` changes nothing about the leak.

### 1.3 Memos have no lifecycle; effects do

`@effect` members are created through `effectifyIfNeeded__` →
`effects__.get(obj)` (an `Effects` instance, or `obj` itself when it is
`Effectful`) → `effects.createEffect(fn)`. All effects of an instance are owned
by that instance's root, and `stopEffects(obj)` / `startEffects(obj)` dispose
and recreate them. Custom elements call these from
`connectedCallback`/`disconnectedCallback` (e.g. `LumeElement`).

`@memo` members are **rogue**: public ones are owned by whatever owner happened
to be active at construction (`null`, or a Solid component/effect arbitrarily
far up the tree); private ones are unowned. Consider a tree of custom elements
rendered under a top‑level Solid component: every element's effects are torn
down on disconnect, but its memos are either never disposed or disposed only
when the _top‑level component_ unmounts. Nothing about a memo's lifetime
matches the element it belongs to.

### 1.4 Public and private members are implemented differently

Public members go through `memoify()` (per‑instance `Object.defineProperty` at
finalization, `setMemoifyMemberStat` side‑channel, subclass‑override skipping
logic). Private members are handled entirely inside the decorator with a
per‑member `WeakMap<instance, memo>`. The TODO above `if (context.private)` in
`memo.ts` already says public members should follow the private pattern.

## 2. Design

### 2.1 Goals

1. **Lazy**: a memo's computation is created on first read, never during field
   initialization. Unread memos cost nothing.
2. **Owned like effects**: `createMemo()` classifies its call site exactly as
   `createEffect()` does. Called at construction time (constructor, or the
   scope that instantiated the object), the memo is owned by the instance root
   — the same root as its `@effect`s — so `stopEffects(obj)` disposes memos and
   effects together and `startEffects(obj)` brings both back. Called inside one
   of the instance's own effects, it is a lazy memo owned by that effect.
3. **Stable accessors**: the function/getter a consumer holds never changes
   across stop/start. A restart notifies dependents so they re‑read and pick up
   the freshly created memos.
4. **One implementation** for getter, getter+setter, auto‑accessor and method
   forms, public or private. No `memoify()` in the decorator path. Laziness
   lives in exactly one place — `createLazyMemo` (§2.2.1) — used by both
   `Effectful` paths, the decorator, and `memoify()`.

### 2.2 `Effectful.createMemo()` / `Effectful.createWritableMemo()`

The single home for lazy, lifecycle‑managed memos. They mirror `createEffect()`
**including its owner classification**: the owner at the call site
(`getOwner()` at the moment `createMemo()` is called — never at first read)
decides who owns the memo, exactly as `#createEffect` decides for effects.
**Every path is lazy**; the paths differ only in who owns the memo once it is
created:

| Call site (`getOwner()` when `createMemo()` is called)                                                                     | `#createEffect` does                                             | `createMemo()` does                                                                                                                                                                                                                                                                                                                                                                         |
| -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| the constructor, or the same scope that instantiated the object (both: `callContext === #parentOwner`), or no owner at all | hooks the effect onto `#owner`                                   | **Effectful‑owned lazy memo** (§2.2.2): created on first read under the Effectful `#owner`, stopped/started with the instance                                                                                                                                                                                                                                                               |
| inside one of our own effects (`ownerIsAncestor(#owner, callContext)`)                                                     | delegates to plain `createEffect(fn)`; the nested effect owns it | **thin lazy wrapper owned by the nested effect** (`createLazyMemo`, §2.2.1): captures the call‑site owner, creates the memo under it on first read; that effect disposes it when it re‑runs and re‑creates it by calling `createMemo()` again. No version signal or `#started` handling — the effect tree already manages that lifetime (typical Solid: the memo is read by a deeper child) |
| a parent reactive context other than `#parentOwner`                                                                        | throws                                                           | throws                                                                                                                                                                                                                                                                                                                                                                                      |

```ts
// Effectful.ts (inside EffectfulClass)

// One restart signal per instance. Every Effectful-owned memo accessor reads it, so
// bumping it once in startEffects() re-runs every dependent of every memo.
#memoVersion = createSignal(0)

// Same (fn, value, options) shape as Solid's createMemo / createWritableMemo.
createMemo<T>(fn: (prev: T | undefined) => T, value?: T, options?: MemoOptions<T>): Accessor<T> {
	return this.#memo(fn, value, {...options, writable: false})[0]
}

createWritableMemo<T>(fn: (prev: T | undefined) => T, value?: T, options?: MemoOptions<T>): [Accessor<T>, Setter<T>] {
	return this.#memo(fn, value, {...options, writable: true}) as [Accessor<T>, Setter<T>]
}

// `options` is the same LazyMemoOptions that createLazyMemo takes (§2.2.1):
// MemoOptions plus `writable`. It is passed straight through on every path.
#memo<T>(fn: (prev: T | undefined) => T, value: T | undefined, options: LazyMemoOptions<T>): readonly [Accessor<T>, Setter<T>?] {
	const callContext = getOwner()
	const contextIsChild = ownerIsAncestor(this.#owner, callContext)
	const contextIsParent = ownerIsAncestor(callContext, this.#owner)

	// Same three-way classification as #createEffect.
	if (contextIsChild) return createLazyMemo(fn, value, options) // owner = callContext (captured inside)
	if (contextIsParent && callContext !== this.#parentOwner)
		throw new Error('Do not call .createMemo or .createWritableMemo methods in parent reactive contexts.')

	return this.#lazyMemo(fn, value, options) // owner = #owner
}
```

Unlike `#createEffect` there is no `#isRestarting` branch: memos are not
replayed from stored functions on restart — the stable accessors below
re‑create them on demand.

#### 2.2.1 `createLazyMemo` — the one lazy primitive

`src/signals/createLazyMemo.ts`, exported publicly (it is useful on its own,
e.g. for the field‑ordering case in plain Solid code) and used by **both**
`#memo` paths so the "defer until first read, then create under a fixed
owner" logic exists exactly once:

```ts
import {createMemo, getOwner, runWithOwner, type Accessor, type MemoOptions, type Setter} from 'solid-js'
import {createWritableMemo} from '@solid-primitives/memo'

export type LazyMemoOptions<T> = MemoOptions<T> & {
	/** Create a writable memo (`@solid-primitives/memo` `createWritableMemo`). */
	writable?: boolean
}

// Same (fn, value, options) shape as Solid's createMemo and
// @solid-primitives/memo's createWritableMemo, so `value` is the initial value
// passed to the memo function's `prev` argument on its first run.
export function createLazyMemo<T>(
	fn: (prev: T | undefined) => T,
	value?: T,
	options?: LazyMemoOptions<T> & {writable?: false},
): readonly [Accessor<T>]
export function createLazyMemo<T>(
	fn: (prev: T | undefined) => T,
	value: T | undefined,
	options: LazyMemoOptions<T> & {writable: true},
): readonly [Accessor<T>, Setter<T>]
export function createLazyMemo<T>(fn: (prev: T | undefined) => T, value?: T, options: LazyMemoOptions<T> = {}) {
	// Capture the owner NOW (call site), not at first read: the first read is
	// usually inside some dependent effect, and creating the memo there would
	// let that effect dispose it on its next re-run. To create under a specific
	// owner, wrap the createLazyMemo() call in runWithOwner(owner, ...).
	const owner = getOwner()
	let memo: readonly [Accessor<T>, Setter<T>?] | undefined

	const ensure = () =>
		(memo ??= runWithOwner(owner, () =>
			options.writable ? createWritableMemo(fn, value, options) : [createMemo(fn, value, options)],
		)!)

	const get: Accessor<T> = () => ensure()[0]()
	const set: Setter<T> = v => ensure()[1]!(v)

	return options.writable ? [get, set] : [get]
}
```

Notes:

- `runWithOwner` nulls `Listener` (`dev.js:513`), so _creating_ the memo is not
  tracked by the reader; the subsequent `memo()` read is.
- There is no `owner` option: to pin the memo to a specific owner, call
  `createLazyMemo` inside `runWithOwner(owner, …)` — that is what the option
  would have done, and it is what §2.2.2 does with `#owner`.
- A `null` owner at the call site is valid: the memo is then unowned, exactly
  like a plain top‑level `createMemo` (Solid warns in dev, as it does there).
- Name collision: `Effectful` already imports Solid's `createMemo`; the file
  imports the lazy one as `createLazyMemo` (plus the `LazyMemoOptions` type,
  which `#memo`/`#lazyMemo` use as their `options` parameter type) so there
  is no shadowing.

#### 2.2.2 Effectful‑owned lazy memo

The Effectful‑owned path is `createLazyMemo` pinned to `#owner`, plus the two things
only the instance knows about — its stop/start state and the restart signal:

```ts
#lazyMemo<T>(fn: (prev: T | undefined) => T, value: T | undefined, options: LazyMemoOptions<T>): readonly [Accessor<T>, Setter<T>?] {
	let memo: readonly [Accessor<T>, Setter<T>?] | undefined

	const ensure = () =>
		(memo ??= runWithOwner(this.#owner, () => {
			// Registered on the ROOT, so it fires whenever the root is cleaned — by
			// stopEffects() or by #parentOwner's cleanup. Co-locating the reset with
			// the creation means stopEffects() needs no memo bookkeeping.
			onCleanup(() => (memo = undefined))
			return createLazyMemo(fn, value, options) // captures #owner from runWithOwner
		})!)

	const get: Accessor<T> = () => {
		const [version] = this.#memoVersion
		version() // dependents re-run after startEffects() (§2.3)

		// Stopped: plain derived getter. Nothing is created, nothing can leak (§2.4).
		// No memo exists, so there is no previous value; pass the initial value.
		if (!this.#started) return fn(value)

		return ensure()[0]()
	}

	const set: Setter<T> = v => {
		if (!this.#started) throw new Error('Cannot write to a memo while effects are stopped.') // §2.4
		return ensure()[1]!(v)
	}

	return options.writable ? [get, set] : [get]
}
```

(`memo` is reset to `undefined` on root cleanup, so `ensure()` builds a fresh
`createLazyMemo` — and thus a fresh Solid memo — on the next read after
`startEffects()`. The `runWithOwner(this.#owner, …)` does double duty: it is
where the `onCleanup` reset is registered, and it is the owner `createLazyMemo`
captures — one place, so they cannot desync. The wrapper is created lazily
here only because it must be re‑creatable; its own inner memo is created on
the first call through `get`.)

Why the Effectful‑owned path pins the owner to `#owner` and not to the
`createMemo()` call site like the nested path: for this path the call site is
the constructor (`#owner`), or the instantiating scope (`#parentOwner`, or
`null`). In all three cases the memo must live and die with the instance, and
`#owner` is the root that `stopEffects()` disposes — so `#owner` is the
correct owner, not `#parentOwner`. The nested path is the counterpart: there
the call site _is_ a child effect, so the lazy wrapper captures that effect as
owner and the memo is created under it on first read — standard Solid
semantics:

```ts
createEffect(() => {
	const prod = obj.createMemo(() => obj.a * obj.b) // lazy wrapper owned by this effect
	createEffect(() => console.log(prod())) // deeper child reads it → memo created under the outer effect
})
```

When the outer effect re‑runs it disposes `prod`'s memo and the re‑executed
`createMemo()` call hands out a new wrapper; the version signal and `#started`
are irrelevant to it (and must not be consulted — a stopped instance still has
to serve a memo created inside its own live effect tree, which by construction
only exists while started).

### 2.3 `startEffects()` / `stopEffects()`

```ts
startEffects() {
	if (this.#started) return
	this.#started = true

	// 1. Notify memo dependents FIRST, while no effects of ours exist yet.
	//    External dependents re-run, read the accessors, and lazily create memos.
	//    (Bumping after recreating our effects would make every one of them
	//    run twice on each start.)
	const [, setVersion] = this.#memoVersion
	setVersion(v => v + 1)

	// 2. Recreate effects (existing code). They read memos → created on demand.
	this.#isRestarting = true
	try { for (const fn of this.#effectFunctions) this.#createEffect(fn) }
	finally { this.#isRestarting = false }
}

stopEffects() {
	if (!this.#started) return
	this.#started = false
	this.#dispose?.() // cleanNode(root): disposes memos + effects, runs the onCleanup that resets each `memo`
}
```

#### 2.3.1 Parent‑owner disposal goes through `stopEffects()`

Today the `#owner` initializer registers `onCleanup(this.#dispose)` on
`#parentOwner`. That disposes the root but leaves `#started === true`, so the
instance is in a lie: effects and memos are gone, `startEffects()` is a no‑op
(`if (this.#started) return`), and the next memo read would revive the root
via `ensure()` — detached from the parent that just disposed it.

Change it to:

```ts
#owner: Owner = (() => {
	let owner: Owner
	runWithOwner(this.#parentOwner, () => {
		createRoot(dispose => {
			owner = getOwner()!
			this.#dispose = dispose
		})
		// Route parent cleanup through stopEffects() so #started is kept
		// truthful: memos and effects are disposed AND the instance knows it is
		// stopped, so reads fall back to fn() (§2.4) instead of reviving the
		// root, and a later startEffects() can legitimately bring it back.
		if (this.#parentOwner) onCleanup(() => this.stopEffects())
	})
	return owner!
})()
```

Nothing else changes: `stopEffects()` already guards on `#started`, so a parent
cleanup after an explicit `stopEffects()` is a no‑op, and vice versa.

`clearEffects()` is unchanged: it clears stored _effect functions_. Memo
accessors are not stored functions (they are the class's members); after
`clearEffects()` + `startEffects()` a read simply recreates its memo.

How stop/start interacts with Solid internals: `cleanNode(root)`
(`dev.js:948`) recursively cleans every owned computation — pops each memo out
of its sources' `observers` (so the memo can no longer be re‑run by a source
write) and runs root `cleanups` (our `memo = undefined` resets). A dependent
that still lists the dead memo in its `sources` drops it the next time it
re‑runs (its own `cleanNode`), which the version bump guarantees on restart.

### 2.4 Behavior while stopped — decided

Reads while stopped call `fn()` directly (**tracked**, not `untrack`ed):
correct current value, no computation created, nothing to leak. Because
`Listener` is the reader, the reader tracks `fn`'s raw dependencies for that
run — i.e. the memo degrades to an ordinary derived getter (exactly what the
de‑memoed `composedParent` is today). After `startEffects()` the version bump
re‑runs the reader, which now gets the real memo and re‑collects dependencies.

Rejected alternatives, for the record:

- `untrack(fn)` while stopped — a reader that only ever reads while stopped
  would never see changes.
- Creating the memo anyway while stopped — produces live computations on a
  "stopped" instance that nothing will ever dispose (a disconnected element
  read once by an external effect would be pinned by any global store it
  depends on — the exact leak from §1.2).

Writes while stopped **throw** (`Cannot write to a memo while effects are
stopped.`): the override could not be observed and would be discarded on
restart anyway (a fresh memo recomputes from dependencies; overrides are
already documented as non‑persistent), so silently accepting it would hide a
bug in the caller.

### 2.5 The `@memo` decorator: one path for all forms

Every form becomes: a **prototype‑level replacement** (getter / method /
accessor `{get, set, init}`) plus a per‑member `WeakMap<instance, StableAccessor>`,
where `StableAccessor` is whatever `effects.createMemo()` /
`effects.createWritableMemo()` returned for that instance. First read on an
instance does:

```ts
function readMemo(this: AnyObject) {
	// Before this class's members are finalized (signals not yet signalified)
	// there is no memo to read — see §2.6. Computing the body directly is NOT a
	// substitute: if the read happens inside an effect, that effect would track
	// the body's raw dependencies (not signals yet, so effectively nothing)
	// instead of the memo, and would never re-run when the memo changes. That
	// is unworkable, so this is an error, not a fallback. Typical cause: a field
	// initializer or constructor reading a memo before the last @signal field of
	// the class — see README "Field Initialization Order".
	if (!isFinalized__(this, members))
		throw new Error(
			`@memo "${String(name)}" on ${
				this.constructor.name
			} was read before its class finished initializing (before the last @signal field). ` +
				`No memo exists yet, so an effect reading it here would never re-run. ` +
				`Move the read after construction, or declare non-signal fields before @signal fields.`,
		)

	let stable = record.storage.get(this)
	if (!stable) {
		const effects = getEffects__(this) // exists: created at finalization (§2.6)
		const compute = () => memoFn.call(this)
		// The first read typically happens INSIDE some effect. Calling
		// effects.createMemo() from there would classify as "nested in an
		// effect" (§2.2) and hand the memo to that effect — wrong for a class
		// member, which must live as long as the instance. Decorated members are
		// declared at construction time, so create them as if called there:
		// with no owner, which #memo() routes to the Effectful-owned lazy path.
		stable = runWithOwner(null, () =>
			record.writable ? effects.createWritableMemo(compute) : [effects.createMemo(compute)],
		)!
		record.storage.set(this, stable)
	}
	return stable
}
```

The pre‑finalization read is an **error**, not a fallback. A direct compute
would return the right value once, but an effect performing that read would
be permanently broken (it never tracks the memo), and a silently non‑updating
effect is worse than a loud failure at the read site. The old eager
implementation did the direct compute via the raw prototype getter without
telling anyone; that is exactly the class of silent staleness this whole plan
exists to remove. The fix on the caller's side is always the same two options
named in the message. Note this is the _class's own_ finalization: reading a
base‑class memo from a subclass field initializer is fine, since the base
class finalized before the subclass's fields ran.

`runWithOwner(null, …)` also nulls `Listener`, so the creation itself is not
tracked by the reader; only the subsequent accessor call is. (`memoify()` in
§2.7 has the same concern for reads that happen inside effects and uses the
same wrapper.)

Per form:

| Form                                            | Prototype replacement | Read                                                                                                                                                   | Write                                                                                                |
| ----------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| getter (`@memo get x`)                          | getter                | `readMemo()[0]()`                                                                                                                                      | none → assignment throws natively in strict mode (accessor with no setter)                           |
| getter + setter (`@memo get x` / `@memo set x`) | getter + setter       | `readMemo()[0]()`                                                                                                                                      | `readMemo()[1](v)`                                                                                   |
| method (`@memo x()` / `@memo x(_v?)`)           | method                | `x()` → `readMemo()[0]()`                                                                                                                              | arity > 0: `x(v)` → `readMemo()[1](v)`; arity 0: `x(v)` throws `Cannot set readonly memoized method` |
| auto‑accessor (`@memo accessor x = fn`)         | `{get, set, init}`    | `init(fn)` stores `fn` per instance (throws `memo value for "x" is not a function: …` if not a function); `get` returns the stable call‑style function | `set` (assignment) throws — call `x(v)` instead                                                      |

`writable` is decided **at first read**, at runtime, long after both decorators
ran: the setter decorator marks the member record `writable = true`; methods
and accessor arrow functions use `fn.length > 0` (unchanged rule). The
getter+setter pair share the record through `context.metadata` (own storage
per class via `Object.hasOwn`, as `getGetterSetterMemos` does today, so a
subclass override gets its own `WeakMap` and base + sub memos coexist per
instance for `super.x` extension).

Because nothing is created eagerly, the `memoify()` subclass‑override skipping
logic ("skip base memoify if a subclass overrides") is no longer needed: an
override simply means the base wrapper is never called unless the override
calls `super`.

The getter‑setter "Memo not initialized yet. Access the getter first" error
goes away: a write before any read creates the writable memo (one compute)
then applies the override.

Add every replacement getter / method / accessor‑getter to `isMemoGetter__` so
`signalify()` keeps skipping memo members.

### 2.6 Finalization: when the `Effects` instance is created

Two constraints:

1. The `Effects` instance **must be created during construction**, never
   lazily at first read. `Effectful` captures `#parentOwner = getOwner()` at
   construction and registers `onCleanup(#dispose)` on it. If the instance were
   created inside the external effect that happens to read a memo first, the
   _entire_ instance (all its effects and memos) would be disposed on that
   effect's next re‑run.
2. A memo must not be created before its class's signals are signalified, or it
   tracks nothing and is stale forever. Today an early read hits the raw
   prototype getter (harmless plain compute); with a prototype‑level wrapper it
   would create a memo.

So `@memo` **keeps registering a member stat** (needed so
`finalizeMembersIfLast__` runs even for classes with no `@signal` fields or
`@effect`s), but its `finalize` no longer creates anything:

```ts
stat.finalize = function () {
	getEffects__(this) // create the Effects instance now, with the construction-time owner
}
```

and `finalizeMembersIfLast__` records completion per (instance, class):

```ts
// _state.ts
const finalized__ = new WeakMap<AnyObject, WeakSet<MetadataMembers>>()
export function isFinalized__(obj, members) {
	return !!finalized__.get(obj)?.has(members)
}
// … at the end of finalizeMembersIfLast__:
;(finalized__.get(obj) ?? finalized__.set(obj, new WeakSet()).get(obj)!).add(members)
```

Reads before that point **throw** (§2.5). The "read a memo from a field
initializer placed before the last `@signal` field" case, per class in the
hierarchy, is no longer tolerated: an effect that performs such a read would
track the memo body's raw dependencies instead of the memo and never re‑run,
which is not a workable state to leave an app in.

`getEffects__(obj)` is extracted from `effectifyIfNeeded__` into `_state.ts`
and shared by `@memo`, `@effect` and `memoify()`:

```ts
export function getEffects__(obj: AnyObject): AnyEffectful {
	let effects = effects__.get(obj)
	if (effects) return effects
	effects__.set(obj, (effects = isAnyEffectful(obj) ? obj : new Effects()))
	// Put the instance in the right initial state regardless of which decorator
	// reaches it first (memos finalize before effects in customSortOrder).
	const ctor = obj.constructor as AutoStartable
	if (ctor.autoStartEffects === false) effects.stopEffects()
	return effects
}
```

`effectifyIfNeeded__` then reduces to `autoStart ? effects.createEffect(fn) : effects.addEffectFn(fn)`.

### 2.7 `memoify()` (non‑decorator API) — decided

Same mechanism, so plain objects and decorator‑less classes get lazy,
Effectful‑owned, disposable memos: `memoify(obj, …)` defines the property with
`getEffects__(obj).createMemo(...)` / `.createWritableMemo(...)`, wrapped in
`runWithOwner(null, …)` like `readMemo` (§2.5) — `memoify()` is normally called
from a constructor or top level, but if it runs inside an effect the memo must
still belong to `obj`, not to that effect. Consumers dispose with
`stopEffects(obj)` and revive with `startEffects(obj)` (from `effect.ts`),
which already work via `effects__`. Because `getEffects__` returns `obj`
itself when `obj` is `Effectful`, `memoify(this, …)` in an `Effectful`
constructor shares one root with that class's `@effect`s and
`this.createEffect()` calls — `this.stopEffects()` stops all of them together.
The decorator‑only plumbing in `memoify.ts` (`memberStat`,
`setMemoifyMemberStat`, `isAutoAccessor`, the leafmost‑value override check)
is deleted; `memoify` keeps its explicit/automatic key modes and the
readonly/writable arity rules.

The currently staged edits to `memoify.test.ts` (wrapping `signalify`/`memoify`
in a `createRoot` inside the constructor to get a disposable owner) become
unnecessary — those tests can call `stopEffects(ex)` instead.

### 2.8 Consequences for the field‑ordering rule

Laziness removes the eager memo _body_ run at finalization. It does **not**
change _when finalization happens_: effects are still created at the last
`@signal` field's initialization and are eager, so an `@effect` that reads a
memo still runs the memo body at that moment. The documented rule
("non‑signal fields before `@signal` fields, or a trailing dummy `@signal`")
stays as is; README wording is adjusted so it doesn't promise the lazy memo
eliminates the gotcha (it eliminates it only for memos not read eagerly during
construction).

Concrete Lume outcome: `LumeElement` sets `static autoStartEffects = false`, so
its `Effects` instance is created **stopped**. Any read of `composedParent`
before `connectedCallback` (template construction, `childConnectedCallback`)
computes directly and caches nothing; the memo is first created when
`startEffects(this)` runs in `connectedCallback`, with the element in the real
DOM. `@memo` can be restored on `composedParent` and `isComposed`.

## 3. Implementation steps

### Step 1 — ✅ `createLazyMemo` + `Effectful` memo support

- [x] `src/signals/createLazyMemo.ts` per §2.2.1 (`(fn, value?, {writable, ...MemoOptions}?)` — same positional shape as Solid's `createMemo`; `value` forwarded as the initial value; captures `getOwner()` at the call site — pin an owner by wrapping the call in `runWithOwner`; overloads for readonly `[get]` / writable `[get, set]`). Export from `signals/index.ts`.
- [x] `Effectful`: `#memoVersion = createSignal(0)`; public `createMemo(fn, value?, options?)`, `createWritableMemo(fn, value?, options?)` (Solid‑shaped; `value` optional in both, matching `@solid-primitives/memo`); private `#memo(fn, value, options: LazyMemoOptions)` (`writable` travels inside `options`, same object handed to `createLazyMemo` on every path) with the same three‑way owner classification as `#createEffect` (child → `createLazyMemo(fn, {writable})` owned by the call‑site effect; foreign parent → throw; else Effectful‑owned) per §2.2; private `#lazyMemo(fn, value, options: LazyMemoOptions)` = `createLazyMemo` inside `runWithOwner(#owner)` + version read + stopped handling per §2.2.2.
- [x] `startEffects()`: set `#started`, bump version, then recreate effects (§2.3).
- [x] Root‑cleanup reset: `onCleanup(() => (memo = undefined))` registered inside the `runWithOwner(this.#owner, …)` in `#lazyMemo`'s `ensure` (§2.2.2); `stopEffects()` unchanged.
- [x] `#owner` initializer: `onCleanup(() => this.stopEffects())` on `#parentOwner` instead of `onCleanup(this.#dispose)` (§2.3.1), so a parent‑owner disposal also flips `#started = false` and a later `startEffects()` can revive the instance instead of being a no‑op.
- [x] JSDoc on the mixin: memos share the root with effects; calling `createMemo()` inside one of the instance's effects creates a lazy memo owned by that effect (same rule as `createEffect()`).

### Step 2 — ✅ `_state.ts`

- [x] `getEffects__(obj)` with initial `autoStartEffects` state (§2.6); `effectifyIfNeeded__` uses it.
- [x] `finalized__` + `isFinalized__(obj, members)`; mark at the end of `finalizeMembersIfLast__`.
- [x] Delete `memoifyIfNeeded__`.

### Step 3 — ✅ `decorators/memo.ts`: single path

- [x] Per‑member record in `context.metadata` (`classySolid_memos[name] = {writable, storage}`; own per class). Replace `classySolid_getterSetterMemos` / `getGetterSetterMemos` in `types.ts`.
- [x] Remove the `if (context.private)` fork; getter / setter / method / accessor replacements per §2.5 for public and private alike. Keep `getMemberStat__` + `addInitializer(finalizeMembersIfLast__)`; `stat.finalize = () => getEffects__(this)`.
- [x] Delete both `createRoot(...)` memo creations, the stray `debugger` (`memo.ts:208`), and the "Memo not initialized yet" setter error.
- [x] Keep decorator‑time checks: static → throw; field → throw `@memo is not supported on class fields.`; accessor `init` non‑function → throw `memo value for "x" is not a function: …`.
- [x] Pre‑finalization read → `throw` (message per §2.5). No direct‑compute fallback.

### Step 4 — ✅ `signals/memoify.ts`

- [x] Route through `getEffects__(obj).createMemo` / `.createWritableMemo` (§2.7); delete decorator‑mode plumbing.
- [x] Update README `memoify()` section: lazy; dispose with `stopEffects(obj)`.

### Step 5 — ✅ Tests

- [x] `createLazyMemo.test.ts`: not run until first read; cached; recomputes on dependency change; effect reading it re‑runs; **first read inside an effect does not hand ownership to that effect** (the effect re‑runs on a dependency change and the memo keeps updating — the bug the eager version of the old `memo.ts:159` pattern would have); wrapping the call in `runWithOwner(owner, …)` pins the memo to that owner (disposed when it is disposed); called with no owner → unowned like a top‑level `createMemo`; writable variant read/write/override‑then‑dependency‑change; `value` reaches `fn` as `prev` on the first run (readonly and writable); `MemoOptions.equals` passes through.
- [x] `Effectful.test.ts`, Effectful‑owned path (`createMemo`/`createWritableMemo` called in the constructor and in the instantiating scope): lazy (body not run until read); cached; recomputes on dependency change; effect reading it re‑runs on change; `stopEffects` → no recompute on dependency change, read returns fresh `fn()` value and the reader tracks `fn`'s dependencies; `startEffects` → dependents re‑run once (not twice) and track the recreated memo again; writable override then dependency change; write while stopped throws; a stopped read passes `value` as `prev` to `fn`; a memo first READ inside an external effect survives that effect's re‑run (owned by the Effectful root, not the reader); parent‑owner disposal flips the instance to stopped (§2.3.1), resets memos, and a subsequent `startEffects()` revives it.
- [x] `Effectful.test.ts`, nested path: `obj.createMemo()` called inside one of `obj`'s own effects returns a lazy wrapper owned by that effect — body not run until a deeper child reads it; disposed and recreated when the owning effect re‑runs (the §2.2 example); unaffected by `stopEffects`/`startEffects` bookkeeping other than through its owning effect; `createMemo()` from a foreign parent context throws.
- [x] `memo.test.ts`: field‑order test (`@signal a; runs = 0; @memo get doubled(){ this.runs++ }` → `runs === 1` after first read); "not run until read"; public and private getter/setter/method/accessor all share behavior (readonly assignment throws, writable works, writes before first read work); a decorated memo first read inside an external effect is Effectful‑owned (survives the effect's re‑run — exercises the `runWithOwner(null, …)` in `readMemo`); existing subclass override/extension tests unchanged; remove `console.log('sum?', …)`.
- [x] `index.test.ts` `MyElement3`/`MyElement4` (stop/start via `disconnectedCallback`/`connectedCallback` with a `@memo` read by an `@effect`) must pass unchanged — they are the lifecycle acceptance test.
- [x] `memoify.test.ts` — `memoify()` now yields lazy, Effectful‑owned, disposable memos (§2.7), on plain objects AND decorator‑less classes:
  - drop the staged `createRoot` wrappers (a disposable owner is no longer needed to clean up).
  - lazy: `computeCount === 0` after `memoify(obj, 'sum')`, `1` after the first read (method, getter, and getter+setter forms).
  - owned: `effects__.get(obj)` exists after `memoify()` (an `Effects` instance for plain objects / non‑Effectful classes; `obj` itself when `obj` is `Effectful`), and it is the SAME instance `@effect`/`createEffect` would use — so on an `Effectful` class, `memoify(this, …)` in the constructor and `@effect` members share one root.
  - disposable: `stopEffects(obj)` → dependency change does NOT recompute; read returns fresh `fn()` (tracked); write to a writable memo throws; `startEffects(obj)` → dependents re‑run once and recompute resumes.
  - leak regression: memoify an object whose memo reads a module‑level signal, read it once from an external effect, `stopEffects(obj)` → the signal's `observers` no longer contain the memo (the §1.2 leak class, provable via a `createRoot`‑owned effect count or by asserting the effect stops firing after a signal write).
  - first read inside an external effect is Effectful‑owned (the effect re‑runs on a dependency change and the memo keeps updating) — exercises the `runWithOwner(null, …)` wrapper in `memoify()`.
  - `signalify()` still skips memoified members (`isMemoGetter__`) and `memoify()` still skips already‑signalified/memoified ones.
  - existing behavior tests (explicit/automatic key modes, arity rules, readonly assignment throws, chained memos, no‑dependency memo) unchanged.
- [x] Also verify: reading a memo before finalization throws with the §2.5 message and creates no memo (and the same memo works normally once the instance is constructed — e.g. a memo read in a `constructor` _after_ `super()` in a class whose `@signal` fields all precede the read is fine); reading a BASE class memo from a SUBCLASS field initializer does not throw; class with only `@memo` + `@signal` getter/setters (no signal fields, no effects) still gets memos created.

### Step 6 — ✅ Documentation

- [x] README `@memo`: lazy; owned by the instance root; `stopEffects`/`startEffects` semantics; behavior while stopped; accessors are stable.
- [x] README `Effectful`/`Effects`: `createMemo`, `createWritableMemo` — same call‑site rules as `createEffect` (constructor/instantiating scope → instance root; inside own effect → owned by that effect).
- [x] README new "Non‑decorator APIs" entry: `createLazyMemo(fn, options)`.
- [x] README "Field Initialization Order": keep the rule; fix the closing paragraph per §2.8.
- [x] `dev-docs/NOTES.md` index entry (this doc).

### Step 7 — Downstream (Lume repo, after a classy-solid release)

- [ ] Restore `@memo` on `CompositionTracker.composedParent` and `isComposed`; verify `bit-mae.html` and the other examples render (Playwright, cold load).
- [ ] Run every example and test (Playwright, cold load) and check for the pre‑finalization `@memo … was read before its class finished initializing` error; each hit is an early read to move or a field‑order fix in Lume. Record the findings here.
- [ ] `LumeElement`: no API change required; confirm `runWithOwner(this.#reactiveRoot, () => startEffects(this))` still behaves (the memo version bump happens inside `startEffects`).

## 4. Decisions

Decided:

1. ~~§2.4 reads while stopped~~ → **tracked `fn()`** (plain derived getter).
2. ~~§2.4 writes while stopped~~ → **throw**.
3. ~~§2.2 owner handling~~ → **mirror `#createEffect` exactly**: classify by the owner at the `createMemo()` call site; nested‑in‑own‑effect returns a lazy thin wrapper (`createLazyMemo`) owned by that effect — lazy everywhere, only the owner differs.
4. ~~Single lazy primitive~~ → `createLazyMemo(fn, value?, {writable, ...MemoOptions}?)` in `src/signals/`, public, Solid‑shaped positional args, used by both `Effectful` paths; owner is always the call‑site owner (`runWithOwner` to pin).

5. ~~Parent‑owner cleanup~~ → **`onCleanup(() => this.stopEffects())`** on `#parentOwner` (§2.3.1), replacing `onCleanup(this.#dispose)`.

6. ~~§2.7 `memoify()`~~ → **yes**: `memoify()` on plain objects and decorator‑less classes produces lazy, Effectful‑owned, disposable memos (`stopEffects(obj)` / `startEffects(obj)`), same mechanism as `@memo`. Tests in Step 5.
7. ~~Public API surface~~ → **`Effectful.createWritableMemo` is a separate method** (as shown in §2.2), mirroring Solid's `createMemo` / `@solid-primitives/memo`'s `createWritableMemo` split, and typed cleanly (`Accessor<T>` vs `[Accessor<T>, Setter<T>]`) without conditional return types. `writable` is an _internal_ option on `LazyMemoOptions` / `createLazyMemo` only.

All decisions are made; the plan is ready to implement.

## 5. Out of scope / known limits

- The per‑class finalized marker only guards the class whose members are being
  initialized; the field‑ordering rule (§2.8) remains the contract.
- `Effectful` + parent owner: `#owner` is created once and never replaced;
  `#dispose` runs `cleanNode(root)`, which empties the root's `owned` and
  `cleanups` but leaves the root object usable, so `startEffects()` simply
  attaches new effects/memos to the same root. After a parent‑owner disposal
  the instance is stopped (§2.3.1) and its root's `owner` link still points at
  the now‑disposed parent; a later `startEffects()` therefore revives effects
  and memos that no parent will ever clean up again. That is legitimate for
  the custom‑element case (disconnect → reconnect) but the caller owns the
  matching `stopEffects()`; it is not done automatically.

## 6. Implementation notes (what the plan did not anticipate)

Recorded so the next reader does not re‑derive them. Each is now covered by a
test.

### 6.1 Finalization order inside `finalizeMembersIfLast__`

The plan said: run all finalizers, then mark the class finalized. That is the
wrong order once memo reads throw pre‑finalization (§2.5): `@effect`
finalizers are eager and routinely read `@memo` members on their first run,
and they ran _before_ the marker was set, so every such class threw.

Fix (`_state.ts`): after `sortMetadataMembersCustomOrder`, run the
`signal-field` finalizers, **then set the finalized marker**, then run the
memo and effect finalizers. The marker means "this class's signals are
signalified", which is the precondition a memo read needs; it does not need to
wait for effects. `MyElement3` in `index.test.ts` (`@effect log() { this.result
= this.sum }`) is the regression case.

### 6.2 A stopped memo does not notify its dependents

The plan's Step 5 bullets assumed a dependent effect would keep updating while
the owner is stopped, because the fallback read `fn(value)` is tracked. That
is only true for a read that _happens_ while stopped. A dependent that last
ran while started depends on the **memo node**, which `stopEffects()` disposes
— so a later signal change reaches nothing and the dependent does not re‑run.
It re‑runs exactly once on `startEffects()` (the `#memoVersion` bump) and,
from that run on, depends on the fresh memo.

Behavior is correct and deliberate (a stopped instance is quiescent). The
tests were corrected to assert it: stopped ⇒ external dependents frozen,
direct reads fresh; started ⇒ one catch‑up run.

### 6.3 `Effects` subclass + `memoify()` in the constructor

`@effect` members are finalized during the **base** class's field
initialization — i.e. inside `super()` — so an effect that reads a
`memoify()`'d member runs before the subclass constructor body has called
`memoify(this, …)`, and sees the raw un‑memoized method. Not a bug in the
mechanism: it is the field‑ordering rule (§2.8) meeting constructor bodies.
The supported pattern is `static autoStartEffects = false` + `startEffects()`
at the end of the constructor, which the test now demonstrates.

### 6.4 `@effect` inside a `createRoot` is owned by the instance, not the root

`effect.test.ts` had a test asserting that `stopEffects(p)` is a **no‑op**
when `p` was constructed inside a `createRoot`, on the theory that the
enclosing root owns the effects. It passed under the old `Effectful`, which
created its root lazily on the first `createEffect` and — when constructed
under an existing owner — attached effects directly to that owner.

The current `Effectful` (present before this work, in the staged tree) always
creates its own root as a child of the construction‑time owner. The enclosing
root is the instance's **parent**, and `stopEffects(p)` disposes `p`'s own
root. The old assertion encoded the old implementation, not a requirement.
The test was rewritten to assert the current contract: `stopEffects(p)` stops,
`startEffects(p)` revives (one catch‑up run), and disposing the enclosing root
stops `p` via §2.3.1.

### 6.5 Getter/method `name` must be preserved

Replacing a decorated getter with our own function changes `fn.name` from
`"get sum"` to `"get"`. Babel's `applyDecs` uses that name in its duplicate‑
member error, and stack traces / reflection show it. `memo.ts` now copies the
original `name` onto the replacement getter and method.

### 6.6 Solid: zero‑arity `createRoot` callbacks are unowned

`createRoot(() => …)` (no `dispose` parameter) creates an **unowned** root
with no `.owner` link to the enclosing owner. To nest a root under another
for ancestor‑detection tests, the callback must declare the parameter:
`createRoot(_dispose => …)`.
