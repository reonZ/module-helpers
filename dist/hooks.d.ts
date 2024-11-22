declare function registerUpstreamHook(event: string, listener: HookCallback<any>): number;
declare function createHook(hooks: string | string[], listener: HookCallback<any>): {
    activate(): void;
    disable(): void;
    toggle(enabled: boolean): void;
};
declare function runWhenReady(fn: () => void): void;
type Hook = {
    activate(): void;
    disable(): void;
    toggle(enabled: boolean): void;
};
export type { Hook };
export { createHook, registerUpstreamHook, runWhenReady };
