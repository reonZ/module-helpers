import * as R from "remeda";
import { promptDialog, subLocalize, waitDialog } from ".";
import { getActiveModule, MODULE } from "./module";
import { hasSetting, registerSetting } from "./settings";
import { userIsActiveGM } from "./user";
function registerMigration(migration) {
    const MIGRATIONS = (window.MODULES_MIGRATIONS ??= {
        done: false,
        initialized: false,
        list: [],
        testMigration,
    });
    MIGRATIONS.list.push({
        ...migration,
        module: MODULE.id,
    });
    initializeMigrations();
}
function initializeMigrations() {
    const MIGRATIONS = window.MODULES_MIGRATIONS;
    if (!MIGRATIONS)
        return;
    if (!MIGRATIONS.initialized) {
        MIGRATIONS.initialized = true;
        Hooks.once("ready", runMigrations);
    }
    Hooks.once("init", () => {
        if (hasSetting("__schema"))
            return;
        registerSetting({
            key: "__schema",
            type: Number,
            default: 1.0,
            config: false,
            scope: "world",
        });
    });
}
function getMigrationData(lastVersion) {
    const MIGRATIONS = window.MODULES_MIGRATIONS;
    if (!MIGRATIONS)
        return;
    const modules = {};
    const migrations = [];
    lastVersion ??= Math.max(...MIGRATIONS.list.map((migration) => migration.version));
    for (const migration of MIGRATIONS.list) {
        const { module, version = 1.0 } = (() => {
            const exist = modules[migration.module];
            if (exist === null)
                return {};
            else if (exist)
                return exist;
            const module = getActiveModule(migration.module);
            if (!module)
                return {};
            return (modules[migration.module] = {
                module,
                version: module.getSetting("__schema"),
            });
        })();
        if (!module || version >= lastVersion)
            continue;
        migrations.push(migration);
    }
    migrations.sort((a, b) => a.version - b.version);
    return { modules, migrations, lastVersion };
}
async function testMigration(actor, version) {
    const migrationData = getMigrationData(version);
    if (!migrationData)
        return;
    const { migrations } = migrationData;
    const originalSource = actor.toObject();
    const source = actor.toObject();
    for (const migration of migrations) {
        await migration.migrateActor?.(source);
    }
    return foundry.utils.diffObject(originalSource, source);
}
async function runMigrations() {
    const MIGRATIONS = window.MODULES_MIGRATIONS;
    if (!MIGRATIONS || MIGRATIONS.done || !userIsActiveGM())
        return;
    MIGRATIONS.done = true;
    const { lastVersion, migrations, modules } = getMigrationData();
    if (!migrations.length)
        return;
    const moduleList = R.pipe(modules, R.values(), R.filter(R.isTruthy), R.map(({ module }) => module));
    const localize = subLocalize("SHARED.migration");
    const warningContent = [
        "<div style='font-size: 1rem;'>",
        `<div>${localize("warning.content.modules")}</div>`,
        `<ul style="margin: 0; font-size: 1rem;">`,
    ];
    for (const module of moduleList) {
        warningContent.push(`<li style="font-size: 1rem;">${module.title}</li>`);
    }
    warningContent.push("</ul>", `<div>${localize("warning.content.wait")}</div>`, "</div>");
    const started = await waitDialog({
        title: localize("warning.title"),
        yes: { label: localize("warning.start"), icon: "fa-solid fa-play" },
        no: { label: localize("warning.cancel"), icon: "fa-solid fa-xmark" },
        content: warningContent.join(""),
    }, { top: 100 });
    if (!started)
        return;
    const migratedActors = new Set();
    const migrateActor = async (actor) => {
        let migrated = false;
        const source = actor.toObject();
        for (const migration of migrations) {
            if (await migration.migrateActor?.(source)) {
                migrated = true;
                migratedActors.add(actor);
            }
        }
        return migrated ? source : null;
    };
    const worldActorSources = R.filter(await Promise.all(game.actors.map(migrateActor)), R.isTruthy);
    if (worldActorSources.length) {
        try {
            const ActorClass = getDocumentClass("Actor");
            await ActorClass.updateDocuments(worldActorSources, { noHook: true });
        }
        catch (err) {
            localize.error("error.actors", true);
            console.warn(err);
        }
    }
    for (const scene of game.scenes) {
        for (const token of scene.tokens) {
            const actor = token.actor;
            if (!actor || token.isLinked)
                continue;
            const source = await migrateActor(actor);
            if (source) {
                try {
                    await actor.update(source, { noHook: true });
                }
                catch (err) {
                    localize.error("error.token", { uuid: actor.uuid }, true);
                    console.warn(err);
                }
            }
        }
    }
    for (const module of moduleList) {
        module.setSetting("__schema", lastVersion);
    }
    const hasMigrated = migratedActors.size;
    if (!hasMigrated) {
        promptDialog({
            title: localize("summary.title"),
            content: localize("summary.nothing"),
        });
        return;
    }
    const summaryContent = [`<div>${localize("summary.content")}</div>`];
    if (migratedActors.size) {
        const actorsLabel = game.i18n.localize("PF2E.Actor.Plural");
        summaryContent.push(`<h3 style="margin: 0;">${actorsLabel}</h3>`, `<ul style="margin: 0; list-style: none; padding: 0; font-size: 1rem;">`);
        for (const actor of migratedActors) {
            summaryContent.push(`<li style="font-size: 1rem;">@UUID[${actor.uuid}]</li>`);
        }
        summaryContent.push("</ul>");
    }
    promptDialog({
        title: localize("summary.title"),
        content: await TextEditor.enrichHTML(summaryContent.join("")),
    });
}
export { registerMigration, testMigration };
