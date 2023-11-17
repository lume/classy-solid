import type { Constructor } from 'lowclass';
export type DecoratedValue = Constructor | Function | ClassAccessorDecoratorTarget<object, unknown> | undefined;
export type PropKey = string | symbol;
export interface PropSpec {
    initialValue: unknown;
}
//# sourceMappingURL=types.d.ts.map