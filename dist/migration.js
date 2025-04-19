import { getSetting, registerSetting, setSetting } from "./settings";
function registerMigrations(migrations) {
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
function onReady(migrations) {
    if (getSetting("__migrationSchema") === 0) {
        return setSetting("__migrationSchema", 1);
    }
    if (!migrations)
        return;
}
export { registerMigrations };
