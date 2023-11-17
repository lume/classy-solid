import { Constructor } from 'lowclass';
import { type JSX } from 'solid-js';
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