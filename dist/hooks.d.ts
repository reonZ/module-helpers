declare function registerUpstreamHook(event: string, listener: RegisterHookCallback): number;
declare function createHook(hooks: string | string[], listener: RegisterHookCallback): {
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
type RegisterHookCallback = (...args: any[]) => any;
export type { Hook };
export { createHook, registerUpstreamHook, runWhenReady };
