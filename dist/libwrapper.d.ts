declare function registerWrapper(type: libWrapper.RegisterType, path: string | string[], callback: libWrapper.RegisterCallback, context?: WrapperContext): number[];
declare function unregisterWrapper(id: number | number[]): void;
declare function createSharedWrapper<TDocument extends ClientDocument, TWrapperCallback extends libWrapper.RegisterCallback, TListener extends (...args: any[]) => any>(type: Exclude<libWrapper.RegisterType, "OVERRIDE">, path: string, sharedCallback: (this: TDocument, registered: TListener[], wrapped: () => ReturnType<TWrapperCallback>, args: Parameters<TWrapperCallback>) => void): {
    register: {
        (listener: (document: TDocument, ...args: Parameters<TListener>) => ReturnType<TListener>, options: {
            context: WrapperContext;
            priority?: number;
        }): Wrapper;
        (listener: (this: TDocument, ...args: Parameters<TListener>) => ReturnType<TListener>, options?: {
            context?: undefined;
            priority?: number;
        }): Wrapper;
    };
};
declare function createToggleableWrapper(type: libWrapper.RegisterType, path: string | string[], callback: libWrapper.RegisterCallback, options?: WrapperOptions): Wrapper;
declare function createCreatureSheetWrapper(type: libWrapper.RegisterType, partialPath: string | string[], callback: libWrapper.RegisterCallback, options?: WrapperOptions): Wrapper;
type Wrapper = {
    get enabled(): boolean;
    activate(): void;
    disable(): void;
    toggle(enabled?: boolean): void;
};
type WrapperOptions = {
    context?: WrapperContext;
    onDisable?: () => void;
    onActivate?: () => void;
};
type WrapperContext = InstanceType<new (...args: any[]) => any>;
export { createCreatureSheetWrapper, createSharedWrapper, createToggleableWrapper, registerWrapper, unregisterWrapper, };
export type { Wrapper };
