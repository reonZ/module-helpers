import { createHTMLElement, htmlQuery, localize, MODULE, R } from ".";
function registerKeybind(name, data) {
    game.keybindings.register(MODULE.id, name, {
        ...data,
        name: data.name ?? MODULE.path("keybindings", name, "name"),
        hint: data.hint ?? MODULE.path("keybindings", name, "hint"),
    });
}
function registerModuleKeybinds(keybinds) {
    for (const [group, entries] of R.entries(keybinds)) {
        for (const keybind of entries) {
            game.keybindings.register(MODULE.id, `${group}.${keybind.name}`, {
                ...keybind,
                name: MODULE.path("keybindings", group, keybind.name, "name"),
                hint: MODULE.path("keybindings", group, keybind.name, "hint"),
            });
        }
    }
    Hooks.on("renderControlsConfig", (_, html, options) => {
        onRenderControlsConfig(html, options, keybinds);
    });
}
function onRenderControlsConfig(html, options, keybinds) {
    const id = MODULE.id;
    const tab = htmlQuery(html, `[data-application-part="main"] [data-group="categories"][data-tab="${id}"][data-category="${id}"]`);
    if (!tab)
        return;
    for (const key of R.keys(keybinds)) {
        if (!key)
            continue;
        const group = htmlQuery(tab, `.form-group[data-action-id^="${MODULE.id}.${key}"]`);
        const title = createHTMLElement("h3", {
            content: localize("settings", key, "title"),
        });
        group?.before(title);
    }
}
export { registerKeybind, registerModuleKeybinds };
