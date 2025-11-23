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
 *   // Writable memo via field (requires arrow function, not great for TypeScript type inference)
 *   @memo sum = () => this.a + this.b
 *
 *   // Readonly memo via getter only
 *   @memo get sum2() {
 *     return this.a + this.b
 *   }
 *
 *   // Writable memo via accessor (requires arrow function, not great for TypeScript type inference)
 *   @memo accessor sum3 = () => this.a + this.b
 *
 *   // Readonly memo via method
 *   @memo sum4() {
 *     return this.a + this.b
 *   }
 *
 *   // The following variants are not supported yet as no runtime or TS support exists yet for the syntax.
 *
 *   // Writable memo via accessor, alternative long-hand syntax (not yet released, no runtime or TS support yet)
 *   @memo accessor sum5 { get; set } = () => this.a + this.b
 *
 *   // Readonly memo via accessor with only getter (not released yet, no runtime or TS support yet)
 *   @memo accessor sum6 { get; } = () => this.a + this.b
 *
 *   // Readonly memo via accessor with only getter, alternative syntax (not released yet, no runtime or TS support yet)
 *   @memo accessor sum7 {
 *     get() {
 *       return this.a + this.b
 *     }
 *   }
 * }
 *
 * const ex = new Example();
 *
 * console.log(ex.sum, ex.sum2, ex.sum3, ex.sum4);  // 3 3 3 3
 *
 * createEffect(() => {
 *   console.log(ex.sum, ex.sum2, ex.sum3, ex.sum4);
 * });
 *
 * ex.a = 5; // Logs: 7 7 7 7
 *
 * // This won't log anything since the computed memo values don't change (all still 7).
 * batch(() => {
 *   ex.a = 3;
 *   ex.b = 4;
 * })
 *
 * ex.sum = 20; // Logs: 20 7 7 7 (only sum is updated)
 * ```
 */
export declare function memo(_value: undefined | ((val?: any) => any) | (() => any) | ((val?: any) => void) | (() => void) | ClassAccessorDecoratorTarget<unknown, () => any> | ClassAccessorDecoratorTarget<unknown, (val?: number) => any>, // today's auto-accessors, writable memo
context: ClassFieldDecoratorContext | ClassGetterDecoratorContext | ClassSetterDecoratorContext | ClassAccessorDecoratorContext | ClassMethodDecoratorContext): void;
//# sourceMappingURL=memo.d.ts.map