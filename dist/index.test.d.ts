declare global {
    function expect(...args: any[]): any;
}
export declare function testButterflyProps(b: {
    colors: number;
    wingSize: number;
}, initialColors?: number): void;
declare const MyElement_base: {
    new (...a: any[]): {
        "__#1@#effectFunctions": (() => void)[];
        "__#1@#started": boolean;
        createEffect(fn: () => void): void;
        "__#1@#isRestarting": boolean;
        startEffects(): void;
        stopEffects(): void;
        clearEffects(): void;
        "__#1@#owner": import("solid-js").Owner | null;
        "__#1@#dispose": (() => void) | null;
        "__#1@#createEffect"(fn: () => void): void;
    };
} & {
    new (): HTMLElement;
    prototype: HTMLElement;
};
export declare class MyElement extends MyElement_base {
    a: number;
    b: number;
    runs: number;
    result: number;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
declare const MyElement2_base: {
    new (...a: any[]): {
        "__#1@#effectFunctions": (() => void)[];
        "__#1@#started": boolean;
        createEffect(fn: () => void): void;
        "__#1@#isRestarting": boolean;
        startEffects(): void;
        stopEffects(): void;
        clearEffects(): void;
        "__#1@#owner": import("solid-js").Owner | null;
        "__#1@#dispose": (() => void) | null;
        "__#1@#createEffect"(fn: () => void): void;
    };
} & {
    new (): HTMLElement;
    prototype: HTMLElement;
};
export declare class MyElement2 extends MyElement2_base {
    a: number;
    b: number;
    runs: number;
    result: number;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
}
declare const MyElement3_base: {
    new (...a: any[]): {
        "__#1@#effectFunctions": (() => void)[];
        "__#1@#started": boolean;
        createEffect(fn: () => void): void;
        "__#1@#isRestarting": boolean;
        startEffects(): void;
        stopEffects(): void;
        clearEffects(): void;
        "__#1@#owner": import("solid-js").Owner | null;
        "__#1@#dispose": (() => void) | null;
        "__#1@#createEffect"(fn: () => void): void;
    };
} & {
    new (): HTMLElement;
    prototype: HTMLElement;
};
export declare class MyElement3 extends MyElement3_base {
    runs: number;
    result: number;
    a: number;
    b: number;
    get sum(): number;
    log(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
export declare class MyElement4 extends HTMLElement {
    runs: number;
    result: number;
    a: number;
    b: number;
    get sum(): number;
    log(): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
export declare function testElementEffects(el: Element & {
    a: number;
    b: number;
    result: number;
    runs: number;
}): void;
export {};
//# sourceMappingURL=index.test.d.ts.map