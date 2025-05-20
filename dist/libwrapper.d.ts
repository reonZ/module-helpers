declare function registerWrapper(type: libWrapper.RegisterType, path: string | string[], callback: libWrapper.RegisterCallback, context?: WrapperContext): number[];
declare function unregisterWrapper(id: number | number[]): void;
declare function createSharedWrapper<TDocument extends ClientDocument, TListener extends libWrapper.RegisterCallback>(type: Exclude<libWrapper.RegisterType, "OVERRIDE">, path: string, sharedCallback: (this: TDocument, registered: (() => ReturnType<TListener>)[], wrapped: libWrapper.RegisterCallback) => void): {
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
export { createSharedWrapper, createToggleableWrapper, registerWrapper, unregisterWrapper };
export type { Wrapper };
