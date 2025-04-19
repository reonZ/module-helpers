declare function registerWrapper(type: "OVERRIDE", path: string | string[], callback: libWrapper.RegisterOverrideCallback, context?: WrapperContext): number[];
declare function registerWrapper(type: "WRAPPER" | "MIXED", path: string | string[], callback: libWrapper.RegisterWrapperCallback, context?: WrapperContext): number[];
declare function registerWrapper(type: libWrapper.RegisterType, path: string | string[], callback: libWrapper.RegisterCallback, context?: WrapperContext): number[];
declare function unregisterWrapper(id: number | number[]): void;
declare function createToggleableWrapper<TPath extends string | string[]>(type: "OVERRIDE", path: TPath, callback: libWrapper.RegisterOverrideCallback, options: WrapperOptions): Wrapper;
declare function createToggleableWrapper<TPath extends string | string[]>(type: "WRAPPER" | "MIXED", path: TPath, callback: libWrapper.RegisterWrapperCallback, options: WrapperOptions): Wrapper;
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
export { createToggleableWrapper, registerWrapper, unregisterWrapper };
