declare const MODULE: {
    readonly id: string;
    readonly name: string;
    readonly current: Module & {
        api?: Record<string, any> | undefined;
    };
    readonly isDebug: boolean;
    readonly gameContext: string;
    Error(str: string): Error;
    error(str: string, error?: Error): void;
    log(...args: any[]): void;
    group(label: string): void;
    groupEnd(): void;
    debug(...args: any[]): void;
    debugExpose(expose: Record<string, any>): void;
    apiExpose(expose: Record<string, any>): void;
    devExpose(expose: Record<string, any>): void;
    enableDebugMode(): void;
    path(...path: (string | string[])[]): string;
    register(id: string, options?: ModuleRegisterOptions): void;
};
type ModuleRegisterOptions = {
    game?: string;
};
export { MODULE };
