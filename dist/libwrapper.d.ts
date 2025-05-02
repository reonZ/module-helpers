declare function registerWrapper(type: libWrapper.RegisterType, path: string | string[], callback: libWrapper.RegisterCallback, context?: WrapperContext): number[];
declare function unregisterWrapper(id: number | number[]): void;
declare function createToggleableWrapper(type: libWrapper.RegisterType, path: string | string[], callback: libWrapper.RegisterCallback, options?: WrapperOptions): Wrapper;
declare function activateWrappers(wrappers: Wrapper[]): void;
declare function disableWrappers(wrappers: Wrapper[]): void;
declare function toggleWrappers(wrappers: Wrapper[], enabled?: boolean): void;
type Wrapper = {
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
export { activateWrappers, createToggleableWrapper, disableWrappers, registerWrapper, toggleWrappers, unregisterWrapper, };
