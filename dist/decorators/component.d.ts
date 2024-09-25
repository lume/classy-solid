import { Constructor } from 'lowclass/dist/Constructor.js';
import { type JSX } from 'solid-js';
/**
 * A decorator for using classes as Solid components.
 *
 * Example:
 *
 * ```js
 * ⁣@component
 * ⁣@reactive
 * class MyComp {
 *   ⁣@signal last = 'none'
 *
 *   onMount() {
 *     console.log('mounted')
 *   }
 *
 *   template(props) {
 *     // here we use `props` passed in, or the signal on `this` which is also
 *     // treated as a prop
 *     return <h1>Hello, my name is {props.first} {this.last}</h1>
 *   }
 * }
 *
 * render(() => <MyComp first="Joe" last="Pea" />)
 * ```
 */
export declare function component<T extends Constructor>(Base: T, context?: DecoratorContext): any;
declare module 'solid-js' {
    namespace JSX {
        interface ElementClass {
            template?(props: Record<string, unknown>): JSX.Element;
        }
        interface ElementAttributesProperty {
            PropTypes: {};
        }
    }
}
export type Props<T extends object, K extends keyof T> = Pick<T, K> & {
    children?: JSX.Element;
};
//# sourceMappingURL=component.d.ts.map