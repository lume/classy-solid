import {runWithOwner} from 'solid-js'
import type {AnyObject, ClassySolidMetadata, MemoAccessors, MemoRecord, MetadataMembers, PropKey} from './types.js'
import {
	finalizeMembersIfLast__,
	getEffects__,
	getMemberStat__,
	getMembers__,
	isFinalized__,
	isMemoGetter__,
} from '../_state.js'
import './metadata-shim.js'

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
 * class Example {
 *   @signal a = 1
 *   @signal b = 2
 *
 *   // @memo can be used on a getter, accessor, or method, with readonly and
 *   // writable variants:
 *
 *   // Readonly memo via getter only
 *   @memo get sum1() {
 *     return this.a + this.b
 *   }
 *
 *   // Writable memo via getter with setter
 *   @memo get sum2() {
 *     return this.a + this.b
 *   }
 *   @memo set sum2(value: number) {
 *     // use an empty setter to enable writable (logic in here will be ignored if any)
 *   }
 *
 *   // Readonly memo via auto accessor (requires arrow function, not writable because no parameter (arity = 0))
 *   @memo accessor sum3 = () => this.a + this.b
 *
 *   // Writable memo via auto accessor (requires arrow function with parameter, arity > 0)
 *   // Ignore the parameter, it only enables writable memo
 *   @memo accessor sum4 = (v?: number) => this.a + this.b
 *
 *   // Readonly memo via method
 *   @memo sum5() {
 *     return this.a + this.b
 *   }
 *
 *   // Writable memo via method with parameter (arity > 0)
 *   @memo sum6(value?: number) {
 *     // Ignore the parameter, it only enables writable memo
 *     return this.a + this.b
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
 * const ex = new Example()
 *
 * console.log(ex.sum1, ex.sum2, ex.sum3(), ex.sum4(), ex.sum5(), ex.sum6()) // 3 3 3 3 3 3
 *
 * createEffect(() => {
 *   console.log(ex.sum1, ex.sum2, ex.sum3(), ex.sum4(), ex.sum5(), ex.sum6())
 * });
 *
 * ex.a = 5 // Logs: 7 7 7 7 7 7
 *
 * // This won't log anything since the computed memo values don't change (all still 7).
 * batch(() => {
 *   ex.a = 3
 *   ex.b = 4
 * })
 *
 * ex.sum2 = 20 // Logs: 20 7 7 7 7 7 (only sum2 is updated)
 *
 * ex.sum6(15) // Logs: 20 7 7 7 7 15 (only sum6 is updated)
 *
 * ex.sum1 = 10 // Runtime error: Cannot set readonly property "sum1".
 * ```
 */
export function memo(
	value:
		| ((val?: any) => any) // writable memo via method
		| (() => any) // readonly memo via method
		| ((val?: any) => void) // memo setter
		| (() => void) // memo getter
		| ClassAccessorDecoratorTarget<unknown, () => any> // today's auto-accessors, readonly memo
		| ClassAccessorDecoratorTarget<unknown, (val?: number) => any>, // today's auto-accessors, writable memo
	context:
		| ClassGetterDecoratorContext
		| ClassSetterDecoratorContext
		| ClassAccessorDecoratorContext
		| ClassMethodDecoratorContext,
) {
	if (context.static) throw new Error('@memo is not supported on static fields yet.')

	// @ts-expect-error skip type checking in case of invalid kind in plain JS
	if (context.kind === 'field') throw new Error('@memo is not supported on class fields.')

	const {kind, name} = context
	const metadata = context.metadata as ClassySolidMetadata
	const members = getMembers__(metadata)
	const record = getMemoRecord(metadata, name)

	// A setter only marks the pair writable and forwards writes. It does not
	// count as a member for finalization (it is finalized with its getter).
	if (kind === 'setter') {
		record.writable = true

		return function (this: unknown, val: unknown) {
			readMemo(this as AnyObject, members, record, name)[1]!(val)
		} as any // unable to make TypeScript happy about the return type here at @memo application sites
	}

	// Register a member stat so finalizeMembersIfLast__ runs for this class
	// even when it has no @signal fields or @effects. Finalization does not
	// create the memo (that happens lazily on first read); it only makes sure
	// the Effects instance that will own the memo exists, created with the
	// construction-time owner.
	const memberType = kind === 'accessor' ? 'memo-auto-accessor' : kind === 'method' ? 'memo-method' : 'memo-accessor'
	const stat = getMemberStat__(name, memberType, members, context)
	stat.finalize = function () {
		getEffects__(this as AnyObject)
	}
	context.addInitializer(function () {
		finalizeMembersIfLast__(this as AnyObject, members)
	})

	if (kind === 'getter') {
		record.memoFn = value as (this: unknown) => unknown
		const get = function (this: unknown) {
			return readMemo(this as AnyObject, members, record, name)[0]()
		}
		// Preserve the original getter's `name` (f.e. "get sum") so the
		// replacement is indistinguishable in stack traces, error messages,
		// and reflection.
		Object.defineProperty(get, 'name', {value: (value as Function).name, configurable: true})
		isMemoGetter__.add(get)
		return get
	}

	if (kind === 'method') {
		const memoFn = value as (this: unknown, val?: unknown) => unknown
		// Arity > 0 marks the method as a writable memo (the param is only a marker).
		if (memoFn.length > 0) record.writable = true
		record.memoFn = memoFn

		const method = function (this: unknown, val: unknown = Undefined) {
			const [get, set] = readMemo(this as AnyObject, members, record, name)
			if (val === Undefined) return get()
			if (!set) throw new Error(`Cannot set readonly memoized method "${String(name)}".`)
			return set(val)
		}
		Object.defineProperty(method, 'name', {value: memoFn.name, configurable: true})
		isMemoGetter__.add(method)
		return method
	}

	if (kind === 'accessor') {
		// The auto-accessor's initial value is the memo function. Store it per
		// instance in `init`; the getter hands out a stable call-style
		// function (`obj.x()` reads, `obj.x(v)` writes if arity > 0).
		record.accessorFns ??= new WeakMap()
		const accessorFns = record.accessorFns
		const callables = new WeakMap<object, (val?: unknown) => unknown>()

		const init = function (this: unknown, fn: unknown) {
			if (typeof fn !== 'function') throw new Error(`memo value for "${String(name)}" is not a function: ${fn}`)
			accessorFns.set(this as object, fn)
			return fn
		}

		const get = function (this: unknown) {
			const self = this as AnyObject
			let callable = callables.get(self)
			if (!callable) {
				const memoFn = accessorFns.get(self) as (this: unknown, val?: unknown) => unknown
				const writable = memoFn.length > 0
				callables.set(
					self,
					(callable = (val: unknown = Undefined) => {
						const [get, set] = readMemo(self, members, record, name, memoFn, writable)
						if (val === Undefined) return get()
						if (!set) throw new Error(`Cannot set readonly memoized method "${String(name)}".`)
						return set(val)
					}),
				)
			}
			return callable
		}

		const set = function (this: unknown) {
			throw new Error(
				`Cannot assign to memo accessor "${String(name)}". Call it to write instead: obj.${String(name)}(value)`,
			)
		}

		isMemoGetter__.add(get)
		return {get, set, init}
	}

	throw new Error(`@memo cannot be used on a ${String(kind)}.`)
}

const Undefined = Symbol()

/**
 * Get (creating on first read) the stable memo accessors for `obj`'s `name`
 * member. The memo is created via the instance's `Effects` (so it is lazy,
 * owned by the instance, and stopped/started with its effects).
 */
function readMemo(
	obj: AnyObject,
	members: MetadataMembers,
	record: MemoRecord,
	name: PropKey,
	// Getters/methods store these on the record at decoration time.
	// Auto-accessors pass them per instance (the fn is the instance's initial value).
	memoFn = record.memoFn!,
	writable = record.writable,
): MemoAccessors {
	// Before this class's members are finalized (signals not yet signalified)
	// there is no memo to read. Computing the body directly is NOT a
	// substitute: if the read happens inside an effect, that effect would
	// track the body's raw dependencies (not signals yet, so effectively
	// nothing) instead of the memo, and would never re-run when the memo
	// changes. Typical cause: a field initializer or constructor reading a
	// memo before the last @signal field of the class — see README "Field
	// Initialization Order".
	if (!isFinalized__(obj, members))
		throw new Error(
			`@memo "${String(name)}" on ${
				obj.constructor.name
			} was read before its class finished initializing (before the last @signal field). ` +
				`No memo exists yet, so an effect reading it here would never re-run. ` +
				`Move the read after construction, or declare non-signal fields before @signal fields.`,
		)

	let accessors = record.storage.get(obj)
	if (accessors) return accessors

	if (!memoFn) throw new Error(`@memo setter "${String(name)}" has no matching @memo getter.`)

	const effects = getEffects__(obj) // exists: created at finalization
	const compute = () => memoFn.call(obj)

	// The first read typically happens INSIDE some effect. Calling
	// effects.createMemo() from there would classify as "nested in an
	// effect" and hand the memo to that effect — wrong for a class member,
	// which must live as long as the instance. Decorated members are declared
	// at construction time, so create them as if called there: with no owner,
	// which routes to the Effectful-owned lazy path. runWithOwner(null) also
	// nulls Listener, so the creation itself is not tracked by the reader.
	accessors = runWithOwner(null, () =>
		writable ? effects.createWritableMemo(compute) : ([effects.createMemo(compute)] as const),
	)!

	record.storage.set(obj, accessors)
	return accessors
}

/**
 * Per-class, per-member memo record (see MemoRecord). Own storage per class
 * so a subclass override gets its own record and base + sub memos coexist per
 * instance for `super.x` extension.
 */
function getMemoRecord(metadata: ClassySolidMetadata, name: PropKey): MemoRecord {
	if (!Object.hasOwn(metadata, 'classySolid_memos')) metadata.classySolid_memos = {}
	const memos = metadata.classySolid_memos!
	return (memos[name] ??= {writable: false, storage: new WeakMap()})
}
