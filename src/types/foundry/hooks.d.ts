export {};

interface HookFunction {
    hook: string;
    id: number;
    fn: HookCallback<any>;
    once: boolean;
}

declare global {
    namespace Hooks {
        const events: Record<string, HookFunction[]>;
    }
}
