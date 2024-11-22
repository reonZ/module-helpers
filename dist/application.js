import { isInstanceOf } from "./object";
function renderApplication(type) {
    const types = Array.isArray(type) ? type : [type];
    const apps = Object.values(ui.windows).filter((app) => types.some((x) => isInstanceOf(app, x)));
    for (const app of apps) {
        app.render();
    }
}
function renderCharacterSheets() {
    renderApplication("CharacterSheetPF2e");
}
function renderActorSheets(type) {
    renderApplication(type);
}
function renderItemSheets(type = ["ItemSheetPF2e"]) {
    renderApplication(type);
}
function refreshApplicationHeight(app) {
    if (!app)
        return;
    app.setPosition({ height: "auto" });
}
export { refreshApplicationHeight, renderActorSheets, renderCharacterSheets, renderItemSheets };
