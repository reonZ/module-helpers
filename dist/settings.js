import * as R from "remeda";
import { MODULE } from "./module";
import { createHTMLElement, htmlQuery, localize, userIsGM } from ".";
// "SHARED": {
//    "gmOnly": "GM Only",
//    "reloadRequired": "Requires Reload",
// },
const CACHE = {};
function addExtraInfoToSettingLabel(setting, group) {
    const nameExtras = [];
    if (setting.gmOnly) {
        const label = (CACHE.gmOnlyLabel ??= localize("SHARED.gmOnly"));
        nameExtras.push(label);
    }
    if (setting.requiresReload) {
        const label = (CACHE.reloadLabel ??= localize("SHARED.reloadRequired"));
        nameExtras.push(label);
    }
    if (!nameExtras.length)
        return;
    const labelElement = htmlQuery(group, ":scope > label");
    const extraElement = createHTMLElement("span", {
        innerHTML: ` (${nameExtras.join(", ")})`,
    });
    labelElement?.append(extraElement);
}
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
function registerSetting(options) {
    if (options.gmOnly && !userIsGM())
        return;
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
export { addExtraInfoToSettingLabel, getSetting, hasSetting, registerSettingMenu, registerSetting, setSetting, settingPath, };
