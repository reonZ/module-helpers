import { MODULE, R, userIsGM } from ".";
function settingPath(...path) {
    return MODULE.path("settings", ...path);
}
function getSetting(key) {
    return game.settings.get(MODULE.id, key);
}
function setSetting(key, value) {
    return game.settings.set(MODULE.id, key, value);
}
function hasSetting(key) {
    return game.settings.settings.has(`${MODULE.id}.${key}`);
}
function registerSetting(key, options) {
    if (options.gmOnly && !userIsGM())
        return;
    if ("choices" in options && Array.isArray(options.choices)) {
        options.choices = R.mapToObj(options.choices, (choice) => [
            choice,
            settingPath(key, "choices", choice),
        ]);
    }
    options.name ??= settingPath(key, "name");
    options.hint ??= settingPath(key, "hint");
    options.config ??= true;
    game.settings.register(MODULE.id, key, options);
}
function registerSettingMenu(key, options) {
    options.name ??= settingPath("menus", key, "name");
    options.label ??= settingPath("menus", key, "label");
    options.hint ??= settingPath("menus", key, "hint");
    options.icon ??= "fas fa-cogs";
    game.settings.registerMenu(MODULE.id, key, options);
}
export { getSetting, hasSetting, registerSetting, registerSettingMenu, setSetting };
