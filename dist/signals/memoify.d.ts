import type { MemberStat } from '../decorators/types.js';
/** @private internal only */
export declare function setMemoifyMemberStat(stat: MemberStat): void;
/**
 * Convert properties on an object into Solid.js memoized properties.
 *
 * There are two ways to use this:
 *
 * 1. Define which properties to convert to memoized properties by providing
 * property names as trailing arguments. Properties that are not function-valued
 * or accessors will be ignored.
 * 2. If no property names are provided, all function-valued properties and
 * accessors on the object will be automatically converted to memoized
 * properties.
 *
 * If any property is already memoified with `memoify()`, or already signalified
 * with `signalify()`, it will be skipped.
 *
 * Example with a plain object:
 *
 * ```js
 * import {memoify, signalify} from 'classy-solid'
 * import {createEffect} from 'solid-js'
 *
 * const obj = {
 *   a: 1,
 *   b: 2,
 *   get sum() {
 *     return this.a + this.b
 *   }
 * }
 *
 * signalify(obj, 'a', 'b')
 * memoify(obj, 'sum')
 *
 * createEffect(() => {
 *   console.log('sum:', obj.sum)
 * })
 *
 * obj.a = 3 // updates sum to 5
 * ```
 *
 * Example with a class:
 *
 * ```js
 * import {memoify, signalify} from 'classy-solid'
 * import {createEffect} from 'solid-js'
 *
 * class Example {
 *   a = 1
 *   b = 2
 *
 *   get sum() {
 *     return this.a + this.b
 *   }
 *
 *   constructor() {
 *     signalify(this, 'a', 'b')
 *     memoify(this, 'sum')
 *   }
 * }
 *
 * const ex = new Example()
 *
 * createEffect(() => {
 *   console.log('sum:', ex.sum)
 * })
 *
 * ex.a = 3 // updates sum to 5
 * ```
 */
export declare function memoify<T extends object, K extends keyof T>(obj: T): T;
export declare function memoify<T extends object>(obj: T, ...props: (keyof T)[]): T;
//# sourceMappingURL=memoify.d.ts.map