import { Constructor } from 'lowclass';
import { type JSX } from 'solid-js';
/**
 * A decorator for using classes as Solid components.
 *
 * Example:
 *
 * > Note in the following example that `\@` should be written as `@` without
 * the back slash. The back slash prevents JSDoc parsing errors in this comment
 * in TypeScript.  https://github.com/microsoft/TypeScript/issues/47679
 *
 * ```js
 * \@component
 * \@reactive
 * class MyComp {
 *   \@signal last = 'none'
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