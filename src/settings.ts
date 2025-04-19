import { MODULE, R, userIsGM } from ".";

function settingPath(...path: string[]): string {
    return MODULE.path("settings", ...path);
}

function getSetting(key: "__migrationSchema"): number;
function getSetting<T = boolean>(key: string): T;
function getSetting(key: string) {
    return game.settings.get(MODULE.id, key);
}

function setSetting(key: "__migrationSchema", value: number): Promise<number>;
function setSetting<TSetting>(key: string, value: TSetting): Promise<TSetting>;
function setSetting(key: string, value: any) {
    return game.settings.set(MODULE.id, key, value);
}

function hasSetting(key: string): boolean {
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

    game.settings.register(MODULE.id, key, options as SettingRegistration);
}

function registerSettingMenu(key: string, options: RegisterSettingMenuOptions) {
    options.name ??= settingPath("menus", key, "name");
    options.label ??= settingPath("menus", key, "label");
    options.hint ??= settingPath("menus", key, "hint");
    options.icon ??= "fas fa-cogs";

    game.settings.registerMenu(MODULE.id, key, options as SettingSubmenuConfig);
}

type RegisterSettingOptions = Omit<SettingRegistration, "name" | "scope"> & {
    gmOnly?: boolean;
    name?: string;
    scope: "client" | "world";
};

type RegisterSettingMenuOptions = PartialExcept<SettingSubmenuConfig, "type" | "restricted">;

export { getSetting, hasSetting, registerSetting, registerSettingMenu, setSetting };
