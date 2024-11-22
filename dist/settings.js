import * as R from "remeda";
import { MODULE } from "./module";
function settingPath(...path) {
    return MODULE.path("settings", ...path);
}
function getSetting(key) {
    return game.settings.get(MODULE.id, key);
}
function setSetting(key, value) {
    return game.settings.set(MODULE.id, key, value);
}
function registerSetting(options) {
    if ("choices" in options && Array.isArray(options.choices)) {
        options.choices = R.mapToObj(options.choices, (choice) => [
            choice,
            settingPath(options.key, "choices", choice),
        ]);
    }
    options.name ??= settingPath(options.key, "name");
    options.hint ??= settingPath(options.key, "hint");
    options.scope ??= "world";
    options.config ??= true;
    game.settings.register(MODULE.id, options.key, options);
}
function registerSettingMenu(options) {
    options.name ??= settingPath("menus", options.key, "name");
    options.label ??= settingPath("menus", options.key, "label");
    options.hint ??= settingPath("menus", options.key, "hint");
    options.restricted ??= true;
    options.icon ??= "fas fa-cogs";
    game.settings.registerMenu(MODULE.id, options.key, options);
}
export { getSetting, registerSettingMenu, registerSetting, setSetting, settingPath };
