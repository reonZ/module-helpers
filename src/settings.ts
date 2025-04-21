import { UserPF2e } from "foundry-pf2e";
import { MODULE, R, userIsGM } from ".";

function settingPath(...path: string[]): string {
    return MODULE.path("settings", ...path);
}

function getSetting(key: "__migrationSchema"): number;
function getSetting<T = boolean>(key: string): T;
function getSetting(key: string) {
    return game.settings.get(MODULE.id, key);
}

function getUsersSetting<T = boolean>(key: string): T[];
function getUsersSetting(key: string) {
    const moduleKey = MODULE.path(key);
    return game.settings.storage.get("user").filter((setting) => setting.key === moduleKey);
}

function setSetting(key: "__migrationSchema", value: number): Promise<number>;
function setSetting<TSetting>(key: string, value: TSetting): Promise<TSetting>;
function setSetting(key: string, value: any) {
    return game.settings.set(MODULE.id, key, value);
}

/**
 * modified version of
 * client/helpers/client-settings.mjs#266
 */
async function setUserSetting(user: UserPF2e | string, key: string, value: any) {
    if (!game.ready) {
        throw new Error("You may not set a World-level Setting before the Game is ready.");
    }

    const userId = user instanceof User ? user.id : user;
    const setting = assertSetting(MODULE.id, key);
    const json = cleanJSON(setting, value);
    const current = game.settings.get<Setting>(setting.namespace, setting.key, {
        document: true,
    });

    if (current?._id) {
        await current.update({ value: json });
        return current;
    }

    return getDocumentClass("Setting").create({ key: setting.id, user: userId, value: json });
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

/**
 * client/helpers/client-settings.mjs#247
 */
function assertSetting(namespace: string, key: string) {
    const id = `${namespace}.${key}`;
    if (!namespace || !key) {
        throw new Error(
            `You must specify both namespace and key portions of the setting, you provided "${id}"`
        );
    }
    const setting = game.settings.settings.get(id);
    if (!setting) throw new Error(`"${id}" is not a registered game setting`);
    return setting;
}

/**
 * client/helpers/client-settings.mjs#315
 */
function cleanJSON(setting: SettingConfig, value: unknown): string {
    // Assign using DataField
    if (setting.type instanceof foundry.data.fields.DataField) {
        value = setting.type.clean(value);
        const err = setting.type.validate(value, { fallback: false });
        if (err instanceof foundry.data.validation.DataModelValidationFailure) throw err.asError();
    }

    // Assign using DataModel
    if (foundry.utils.isSubclass(setting.type, foundry.abstract.DataModel)) {
        value = setting.type.fromSource(value || {}, { strict: true });
    }

    // Plain default value
    else if (value === undefined) value = setting.default;
    return JSON.stringify(value);
}

type RegisterSettingOptions = Omit<SettingRegistration, "name" | "scope"> & {
    gmOnly?: boolean;
    name?: string;
    scope: "client" | "world" | "user";
};

type RegisterSettingMenuOptions = PartialExcept<SettingSubmenuConfig, "type" | "restricted">;

export {
    getSetting,
    getUsersSetting,
    hasSetting,
    registerSetting,
    registerSettingMenu,
    setSetting,
    setUserSetting,
};
