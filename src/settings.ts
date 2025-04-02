import * as R from "remeda";
import { MODULE } from "./module";
import { createHTMLElement, htmlQuery, localize } from ".";

// "SHARED": {
//    "gmOnly": "GM Only",
//    "reloadRequired": "Requires  Reload",
// },

const CACHE: SETTINGS_CACHE = {};

function addExtraInfoToSettingLabel(setting: SettingOptions | SettingConfig, group: HTMLElement) {
    const nameExtras: string[] = [];

    if ((setting as SettingOptions).gmOnly) {
        const label = (CACHE.gmOnlyLabel ??= localize("SHARED.gmOnly"));
        nameExtras.push(label);
    }

    if (setting.requiresReload) {
        const label = (CACHE.reloadLabel ??= localize("SHARED.reloadRequired"));
        nameExtras.push(label);
    }

    if (!nameExtras.length) return;

    const labelElement = htmlQuery(group, ":scope > label");
    const extraElement = createHTMLElement("span", {
        innerHTML: ` (${nameExtras.join(", ")})`,
    });

    labelElement?.append(extraElement);
}

function settingPath(...path: string[]) {
    return MODULE.path("settings", ...path);
}

function getSetting<T = boolean>(key: string) {
    return game.settings.get(MODULE.id, key) as T;
}

function setSetting<TSetting>(key: string, value: TSetting) {
    return game.settings.set<TSetting>(MODULE.id, key, value);
}

function hasSetting(key: string) {
    return game.settings.settings.has(`${MODULE.id}.${key}`);
}

function registerSetting(options: SettingOptions) {
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

    game.settings.register(MODULE.id, options.key, options as SettingRegistration);
}

function registerSettingMenu(options: MenuSettingOptions) {
    options.name ??= settingPath("menus", options.key, "name");
    options.label ??= settingPath("menus", options.key, "label");
    options.hint ??= settingPath("menus", options.key, "hint");
    options.restricted ??= true;
    options.icon ??= "fas fa-cogs";

    game.settings.registerMenu(MODULE.id, options.key, options as unknown as SettingSubmenuConfig);
}

type SETTINGS_CACHE = {
    gmOnlyLabel?: string;
    reloadLabel?: string;
};

export {
    addExtraInfoToSettingLabel,
    getSetting,
    hasSetting,
    registerSettingMenu,
    registerSetting,
    setSetting,
    settingPath,
};
