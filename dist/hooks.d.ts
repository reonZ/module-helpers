declare function registerUpstreamHook(event: string, listener: RegisterHookCallback, once?: boolean): number;
declare function createHook(hook: string | string[], listener: RegisterHookCallback): PersistentHook;
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
export { createHook, createHookList, executeWhenReady, registerUpstreamHook };
export type { PersistentHook };
