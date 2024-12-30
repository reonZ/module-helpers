import { ModuleMigration, registerMigration } from "./migration";
import { joinStr } from "./utils";
import * as R from "remeda";

let MODULE_ID = "";

const MODULE = {
    get id() {
        if (!MODULE_ID) {
            throw new Error("Module needs to be registered.");
        }
        return MODULE_ID;
    },
    get name() {
        if (!MODULE_ID) {
            throw new Error("Module needs to be registered.");
        }
        return this.current.title;
    },
    get current() {
        return game.modules.get(this.id) as Module & { api?: Record<string, any> };
    },
    throwError(str: string) {
        throw new Error(`\n[${this.name}] ${str}`);
    },
    error(str: string, error?: Error) {
        let message = `[${this.name}] ${str}`;

        if (error instanceof Error) {
            message += `\n${error.message}`;
        } else if (typeof error === "string") {
            message += `\n${error}`;
        }

        console.error(message);
    },
    debugGroup(...args: any[]) {
        // @ts-expect-error
        if (CONFIG.debug.modules) {
            console.group(`[${this.name}]`, ...args);
        }
    },
    debugGroupEnd() {
        // @ts-expect-error
        if (CONFIG.debug.modules) {
            console.groupEnd();
        }
    },
    debug(...args: any[]) {
        // @ts-expect-error
        if (CONFIG.debug.modules) {
            this.log(...args);
        }
    },
    log(...args: any[]) {
        console.log(`[${this.name}]`, ...args);
    },
    path(...path: (string | string[])[]): string {
        const joined = joinStr(".", ...path);
        return joined ? `${this.id}.${joined}` : `${this.id}`;
    },
    register(id: string, migrations?: ModuleMigration[] | Record<string, ModuleMigration>) {
        if (MODULE_ID) {
            throw new Error("Module was already registered.");
        }

        MODULE_ID = id;

        const migrationList = R.isPlainObject(migrations) ? Object.values(migrations) : migrations;

        for (const migration of migrationList ?? []) {
            registerMigration(migration);
        }
    },
    registerMigration(migration: Omit<ModuleMigration, "module">) {
        registerMigration(migration);
    },
};

function getActiveModule(name: "dice-so-nice"): ExtendedModule<DiseSoNiceModule> | undefined;
function getActiveModule(name: "pf2e-toolbelt"): ExtendedModule<PF2eToolbeltModule> | undefined;
function getActiveModule(name: "pf2e-dailies"): ExtendedModule<PF2eDailiesModule> | undefined;
function getActiveModule<T extends Module>(name: string): ExtendedModule<T> | undefined;
function getActiveModule<T extends Module>(name: string): ExtendedModule<T> | undefined {
    const module = game.modules.get<ExtendedModule<T>>(name);
    if (!module?.active) return;

    module.getSetting = <T = boolean>(key: string) => game.settings.get(name, key) as T;
    module.setSetting = <T>(key: string, value: T) => game.settings.set(name, key, value);

    return module;
}

function getActiveModuleSetting<T = boolean>(name: string, setting: string) {
    const module = game.modules.get(name);
    if (!module?.active) return;

    return game.settings.get(name, setting) as T;
}

type ExtendedModule<TModule extends Module = Module> = TModule & {
    getSetting<T = boolean>(key: string): T;
    setSetting<T>(key: string, value: T): Promise<T>;
};

export { getActiveModule, getActiveModuleSetting, MODULE };
export type { ExtendedModule };
