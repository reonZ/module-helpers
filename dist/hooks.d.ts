declare function createHook(hook: string | string[], listener: RegisterHookCallback): PersistentHook;
declare function createHookList(hooks: {
    path: string | string[];
    listener: RegisterHookCallback;
}[]): PersistentHook;
declare function executeWhenReady(fn: () => void): void;
type PersistentHook = {
    activate(): void;
    disable(): void;
    toggle(enabled?: boolean): void;
};
type RegisterHookCallback = (...args: any[]) => any;
export { createHook, createHookList, executeWhenReady };
export type { PersistentHook };
