import { isInstanceOf, R } from ".";
function renderApplications(type) {
    const types = Array.isArray(type) ? type : [type];
    const apps = [...R.values(ui.windows), ...foundry.applications.instances.values()].filter((app) => types.some((x) => isInstanceOf(app, x)));
    for (const app of apps) {
        app.render();
    }
}
function renderCharacterSheets() {
    renderApplications("CharacterSheetPF2e");
}
function renderActorSheets(type = ["ActorSheetPF2e"]) {
    renderApplications(type);
}
function renderItemSheets(type = ["ItemSheetPF2e"]) {
    renderApplications(type);
}
function enrichHTML(content, options) {
    return foundry.applications.ux.TextEditor.implementation.enrichHTML(content, options);
}
export { enrichHTML, renderActorSheets, renderCharacterSheets, renderItemSheets };
