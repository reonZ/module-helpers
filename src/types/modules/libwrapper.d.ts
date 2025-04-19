export {};

declare global {
    namespace libWrapper {
        type RegisterType = "WRAPPER" | "MIXED" | "OVERRIDE";

        type RegisterCallback = (...args: any[]) => any;

        type RegisterWrapperCallback = <TArgs extends any[], TReturn extends any>(
            wrapped: (...args: TArgs) => TReturn,
            ...args: TArgs
        ) => TReturn;

        type RegisterOverrideCallback = (...args: any[]) => any;

        function register(
            namespace: string,
            path: string,
            fn: RegisterCallback,
            type?: RegisterType
        ): number;

        function unregister(namespace: string, target: number): void;
    }
}
