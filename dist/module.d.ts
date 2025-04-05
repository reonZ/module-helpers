import type { ModuleMigration } from ".";
declare const MODULE: {
    readonly id: string;
    readonly name: string;
    readonly current: Module & {
        api?: Record<string, any> | undefined;
    };
    throwError(str: string): never;
    error(str: string, error?: Error): void;
    log(...args: any[]): void;
    path(...path: (string | string[])[]): string;
    register(id: string, migrations?: ModuleMigration[] | Record<string, ModuleMigration>): void;
};
export { MODULE };
