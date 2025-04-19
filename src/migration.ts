import { getSetting, registerSetting, setSetting } from "./settings";

function registerMigrations(migrations?: ModuleMigrations) {
    Hooks.once("init", () => {
        registerSetting("__migrationSchema", {
            type: Number,
            default: 0,
            scope: "world",
            config: false,
        });
    });

    Hooks.once("ready", () => {
        onReady(migrations);
    });

    // const migrationList = R.isPlainObject(migrations) ? Object.values(migrations) : migrations;
    // for (const migration of migrationList ?? []) {
    //     registerMigration(migration);
    // }
}

function onReady(migrations?: ModuleMigrations) {
    if (getSetting("__migrationSchema") === 0) {
        return setSetting("__migrationSchema", 1);
    }

    if (!migrations) return;
}

type ModuleMigration = {};
type ModuleMigrations = ModuleMigration[] | Record<string, ModuleMigration>;

export { registerMigrations };
export type { ModuleMigration, ModuleMigrations };
