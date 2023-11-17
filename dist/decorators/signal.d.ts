import type { PropKey, PropSpec } from './types.js';
export declare function getKey(): symbol;
export declare function getPropsToSignalify(key: symbol): Map<PropKey, PropSpec>;
export declare function resetPropsToSignalify(key: symbol): void;
export declare function signal(_: unknown, context: ClassFieldDecoratorContext | ClassGetterDecoratorContext | ClassSetterDecoratorContext): any;
//# sourceMappingURL=signal.d.ts.map