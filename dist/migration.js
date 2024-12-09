import * as R from "remeda";
import { error, waitDialog } from ".";
import { getActiveModule, MODULE } from "./module";
import { hasSetting, registerSetting } from "./settings";
import { userIsActiveGM } from "./user";
function registerMigration(migration) {
    const MIGRATIONS = (window.MODULES_MIGRATIONS ??= {
        done: false,
        initialized: false,
        list: [],
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
async function runMigrations() {
    const MIGRATIONS = window.MODULES_MIGRATIONS;
    if (!MIGRATIONS || MIGRATIONS.done || !userIsActiveGM())
        return;
    MIGRATIONS.done = true;
    const modules = {};
    const lastVersion = Math.max(...MIGRATIONS.list.map((migration) => migration.version));
    const migrations = [];
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
    const migratedActors = {};
    const migrateActor = async (actor, isToken) => {
        const uuid = actor.uuid;
        const source = actor.toObject();
        for (const migration of migrations) {
            if ((await migration.migrateActor?.(source)) && !migratedActors[uuid]) {
                migratedActors[uuid] = { source, actor, uuid, isToken };
            }
        }
    };
    for (const actor of game.actors) {
        await migrateActor(actor, false);
    }
    for (const scene of game.scenes) {
        for (const token of scene.tokens) {
            const actor = token.actor;
            if (!actor || token.isLinked)
                continue;
            await migrateActor(actor, true);
        }
    }
    const migratedActorList = Object.values(migratedActors);
    if (!migratedActorList.length)
        return;
    const moduleList = R.pipe(modules, R.values(), R.filter(R.isTruthy), R.map(({ module }) => module));
    const moduleNames = R.map(moduleList, (module) => module.title);
    const plural = moduleNames.length > 1 ? "s" : "";
    const single = moduleNames.length > 1 ? "" : "s";
    const names = moduleNames.length === 1
        ? moduleNames[0]
        : moduleNames.length === 2
            ? moduleNames.join(" & ")
            : moduleNames.slice(0, -1).join(", ") + " & " + moduleNames.at(-1);
    const warningStyle = "style='font-size: 1rem; margin: 0; line-height: 1.2;'";
    const started = await waitDialog({
        title: "Module Migration",
        yes: { label: "Start Migration", icon: "fa-solid fa-play" },
        no: { label: "Cancel", icon: "fa-solid fa-xmark" },
        content: `<p ${warningStyle}>The module${plural} <strong>${names}</strong> need${single} to migrate some data.
        <br>If the system is migrating, please wait before starting.</p>`,
    }, { top: 100 });
    if (!started)
        return;
    const listStyle = "style='margin: 0; list-style: none; padding: 0; font-size: 1rem;'";
    const content = [
        `<p style="margin: 0; font-size: 1rem;">The following documents were migrated by
        <br>the <strong>${names}</strong> module${plural}.</p>`,
    ];
    if (migratedActorList.length) {
        const [tokenActors, worldActors] = R.partition(migratedActorList, (x) => x.isToken);
        if (worldActors.length) {
            try {
                const ActorClass = getDocumentClass("Actor");
                const sources = worldActors.map((x) => x.source);
                await ActorClass.updateDocuments(sources, { noHook: true });
            }
            catch (err) {
                error("An error occured while migrating data for world actors.", true);
                console.warn(err);
            }
        }
        for (const { actor, source, uuid } of tokenActors) {
            try {
                await actor.update(source, { noHook: true });
            }
            catch (err) {
                error(`An error occured while migrating data for the token actor ${uuid}.`, true);
                console.warn(err);
            }
        }
        content.push(`<h3 style="margin: 0;">Actors</h3><ul ${listStyle}>`);
        for (const { source, uuid } of migratedActorList) {
            content.push(`<li style="font-size: 1rem;">@UUID[${uuid}]</li>`);
        }
        content.push("</ul>");
    }
    for (const module of moduleList) {
        module.setSetting("__schema", lastVersion);
    }
    const summary = new foundry.applications.api.DialogV2({
        window: { title: "Module Migration" },
        buttons: [{ label: "Close", icon: "fa-solid fa-xmark" }],
        content: await TextEditor.enrichHTML(content.join("")),
    });
    summary.render(true);
}
export { registerMigration };
