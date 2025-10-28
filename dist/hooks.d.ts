declare function registerUpstreamHook(event: string, listener: RegisterHookCallback, once?: boolean): number;
declare function createToggleableHook(hook: string | string[], listener: RegisterHookCallback, options?: HookOptions): PersistentHook;
declare function createHookList(hooks: {
    path: string | string[];
    listener: RegisterHookCallback;
}[]): PersistentHook;
declare function executeWhenReady(fn: () => void): void;
type PersistentHook = {
    get enabled(): boolean;
    activate(): void;
    disable(): void;
    toggle(enabled?: boolean): void;
};
type RegisterHookCallback = (...args: any[]) => any;
type HookOptions = {
    onDisable?: () => void;
    onActivate?: () => void;
    upstream?: boolean;
};
export { createHookList, createToggleableHook, executeWhenReady, registerUpstreamHook };
export type { HookOptions, PersistentHook };
