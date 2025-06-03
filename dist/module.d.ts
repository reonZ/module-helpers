declare const MODULE: {
    readonly id: string;
    readonly name: string;
    readonly current: Module;
    readonly isDebug: boolean;
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
declare function getActiveModule<T extends Module>(name: string): Maybe<ExtendedModule<T>>;
type ModuleRegisterOptions = {
    game?: string;
};
type ExtendedModule<TModule extends Module = Module> = TModule & {
    getSetting<T = boolean>(key: string): T;
    setSetting<T>(key: string, value: T): Promise<T>;
};
export { getActiveModule, MODULE };
export type { ExtendedModule };
