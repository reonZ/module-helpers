import * as R from "remeda";
import { isInstanceOf, promptDialog, subLocalize, waitDialog } from ".";
import { getActiveModule, MODULE } from "./module";
import { hasSetting, registerSetting } from "./settings";
import { userIsActiveGM } from "./user";
const MANAGER_VERSION = 1;
function registerMigration(migration) {
    const MIGRATIONS = (window.MODULES_MIGRATIONS ??= {
        done: false,
        initialized: false,
        modules: new Map(),
        list: [],
        get context() {
            return R.firstBy([...this.modules.values()], [R.prop("managerVersion"), "desc"]);
        },
        testMigration(doc, version) {
            return this.context.testMigration(doc, version);
        },
        runMigrations() {
            return this.context.runMigrations();
        },
    });
    MIGRATIONS.modules.set(MODULE.id, {
        module: MODULE.id,
        managerVersion: MANAGER_VERSION,
        testMigration,
        runMigrations,
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
        Hooks.once("ready", () => {
            MIGRATIONS.runMigrations();
        });
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
async function testMigration(doc, version) {
    const { migrations } = getMigrationData(version) ?? {};
    if (!migrations)
        return;
    const functionName = isInstanceOf(doc, "ActorPF2e")
        ? "migrateActor"
        : isInstanceOf(doc, "UserPF2e")
            ? "migrateUser"
            : undefined;
    if (!functionName)
        return;
    const originalSource = doc.toObject();
    const source = doc.toObject();
    for (const migration of migrations) {
        await migration[functionName]?.(source);
    }
    return foundry.utils.diffObject(originalSource, source);
}
async function runMigrations() {
    const MIGRATIONS = window.MODULES_MIGRATIONS;
    if (!MIGRATIONS || MIGRATIONS.done || !userIsActiveGM())
        return;
    const { lastVersion, migrations, modules } = getMigrationData();
    if (!migrations.length)
        return;
    const moduleList = R.pipe(modules, R.values(), R.filter(R.isTruthy), R.map(({ module }) => module));
    const localize = subLocalize("SHARED.migration");
    const warningContent = [
        "<div style='font-size: 1rem;'>",
        `<div>${localize("warning.content.modules")}</div>`,
        `<ul style="margin: 0 0 0.5em; font-size: 1rem;">`,
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
    MIGRATIONS.done = true;
    // actors
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
    // users
    const migratedUsers = new Set();
    const userSources = R.filter(await Promise.all(game.users.map(async (user) => {
        let migrated = false;
        const source = user.toObject();
        for (const migration of migrations) {
            if (await migration.migrateUser?.(source)) {
                migrated = true;
                migratedUsers.add(user);
            }
        }
        return migrated ? source : null;
    })), R.isTruthy);
    if (userSources.length) {
        try {
            const UserClass = getDocumentClass("User");
            await UserClass.updateDocuments(userSources, { noHook: true });
        }
        catch (err) {
            localize.error("error.users", true);
            console.warn(err);
        }
    }
    // set schema
    for (const module of moduleList) {
        module.setSetting("__schema", lastVersion);
    }
    // summary
    const hasMigrated = migratedActors.size || migratedUsers.size;
    if (!hasMigrated) {
        promptDialog({
            title: localize("summary.title"),
            content: localize("summary.nothing"),
        });
        return;
    }
    const summaryContent = [`<div>${localize("summary.content")}</div>`];
    for (const [list, title] of [
        [migratedUsers, "PLAYERS.Title"],
        [migratedActors, "PF2E.Actor.Plural"],
    ]) {
        if (!list.size)
            continue;
        const label = game.i18n.localize(title);
        summaryContent.push(`<h3 style="margin: 0;">${label}</h3>`, `<ul style="margin: 0 0 0.5em; list-style: none; padding: 0; font-size: 1rem;">`);
        for (const doc of list) {
            summaryContent.push(`<li style="font-size: 1rem;">@UUID[${doc.uuid}]</li>`);
        }
        summaryContent.push("</ul>");
    }
    promptDialog({
        title: localize("summary.title"),
        content: await TextEditor.enrichHTML(summaryContent.join("")),
    });
}
export { registerMigration };
