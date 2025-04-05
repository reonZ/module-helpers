import { joinStr } from ".";
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
        // const migrationList = R.isPlainObject(migrations) ? Object.values(migrations) : migrations;
        // for (const migration of migrationList ?? []) {
        //     registerMigration(migration);
        // }
    },
};
export { MODULE };
