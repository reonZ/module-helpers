import { MODULE, R, userIsGM } from ".";

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

function registerSetting(key: string, options: RegisterSettingOptions) {
    if (options.gmOnly && !userIsGM()) return;

    if ("choices" in options && Array.isArray(options.choices)) {
        options.choices = R.mapToObj(options.choices, (choice) => [
            choice,
            settingPath(key, "choices", choice),
        ]);
    }

    options.name ??= settingPath(key, "name");
    options.hint ??= settingPath(key, "hint");
    options.config ??= true;

    game.settings.register(MODULE.id, key, options as RegisterSettingOptions & { name: string });
}

type RegisterSettingOptions = Omit<SettingConfig, "config" | "key" | "namespace" | "name"> & {
    name?: string;
    config?: boolean;
    gmOnly?: boolean;
};

export { getSetting, hasSetting, registerSetting, setSetting };
