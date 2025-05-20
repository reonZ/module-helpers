import { isInstanceOf, localize, R } from ".";
function setApplicationTitle(options, ...args) {
    const title = localize(...args);
    foundry.utils.setProperty(options, "window.title", title);
}
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
function renderItemSheets(type = ["ItemSheetPF2e"]) {
    renderApplications(type);
}
export { renderCharacterSheets, renderItemSheets, setApplicationTitle };
