import { joinStr } from ".";
import type { ModuleMigration } from ".";

let MODULE_ID = "";

const MODULE = {
    get id(): string {
        if (!MODULE_ID) {
            throw new Error("Module needs to be registered.");
        }
        return MODULE_ID;
    },
    get name(): string {
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

        // const migrationList = R.isPlainObject(migrations) ? Object.values(migrations) : migrations;

        // for (const migration of migrationList ?? []) {
        //     registerMigration(migration);
        // }
    },
};

export { MODULE };
