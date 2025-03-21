import { registerMigration } from "./migration";
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
        return game.modules.get(this.id);
    },
    get isDebug() {
        // @ts-expect-error
        return CONFIG.debug.modules === true;
    },
    throwError(str) {
        throw new Error(`\n[${this.name}] ${str}`);
    },
    error(str, error) {
        let message = `[${this.name}] ${str}`;
        if (error instanceof Error) {
            message += `\n${error.message}`;
        }
        else if (typeof error === "string") {
            message += `\n${error}`;
        }
        console.error(message);
    },
    debugGroup(...args) {
        if (this.isDebug) {
            console.group(`[${this.name}]`, ...args);
        }
    },
    debugGroupEnd() {
        if (this.isDebug) {
            console.groupEnd();
        }
    },
    debug(...args) {
        if (this.isDebug) {
            this.log(...args);
        }
    },
    log(...args) {
        console.log(`[${this.name}]`, ...args);
    },
    path(...path) {
        const joined = joinStr(".", ...path);
        return joined ? `${this.id}.${joined}` : `${this.id}`;
    },
    register(id, migrations) {
        if (MODULE_ID) {
            throw new Error("Module was already registered.");
        }
        MODULE_ID = id;
        window.fu ??= foundry.utils;
        const migrationList = R.isPlainObject(migrations) ? Object.values(migrations) : migrations;
        for (const migration of migrationList ?? []) {
            registerMigration(migration);
        }
    },
    registerMigration(migration) {
        registerMigration(migration);
    },
};
function getActiveModule(name) {
    const module = game.modules.get(name);
    if (!module?.active)
        return;
    module.getSetting = (key) => game.settings.get(name, key);
    module.setSetting = (key, value) => game.settings.set(name, key, value);
    return module;
}
function getActiveModuleSetting(name, setting) {
    const module = game.modules.get(name);
    if (!module?.active)
        return;
    return game.settings.get(name, setting);
}
export { getActiveModule, getActiveModuleSetting, MODULE };
