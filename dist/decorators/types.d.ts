import type { Constructor } from 'lowclass/dist/Constructor.js';
export type DecoratedValue = Constructor | Function | ClassAccessorDecoratorTarget<object, unknown> | undefined;
export type PropKey = string | symbol;
export type SupportedKind = 'field' | 'getter' | 'setter';
export interface PropSpec {
    initialValue: unknown;
    kind: SupportedKind;
}
//# sourceMappingURL=types.d.ts.map