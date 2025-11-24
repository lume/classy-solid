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
export declare function memo(_value: undefined | ((val?: any) => any) | (() => any) | ((val?: any) => void) | (() => void) | ClassAccessorDecoratorTarget<unknown, () => any> | ClassAccessorDecoratorTarget<unknown, (val?: number) => any>, // today's auto-accessors, writable memo
context: ClassFieldDecoratorContext | ClassGetterDecoratorContext | ClassSetterDecoratorContext | ClassAccessorDecoratorContext | ClassMethodDecoratorContext): void;
//# sourceMappingURL=memo.d.ts.map