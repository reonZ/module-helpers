export {};

declare global {
    interface HookFunction {
        hook: string;
        id: number;
        fn: HookCallback<any>;
        once: boolean;
    }

    class Hooks {
        static get events(): Record<string, HookFunction[]>;
    }

    namespace Hooks {
        function off(
            hook: string,
            fn: number | ((...args: any[]) => boolean | void | Promise<boolean | void>)
        ): void;
    }
}
