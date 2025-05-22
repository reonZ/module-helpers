import { UserPF2e } from "foundry-pf2e";
import {
    createHTMLElement,
    htmlClosest,
    htmlQuery,
    localize,
    MODULE,
    R,
    sharedLocalize,
    userIsGM,
} from ".";

function settingPath(...path: string[]): string {
    return MODULE.path("settings", ...path);
}

function getSetting(key: "__migrationSchema"): number;
function getSetting<T = boolean>(key: string): T;
function getSetting(key: string) {
    return game.settings.get(MODULE.id, key);
}

function getUsersSetting<T = boolean>(key: string): (Setting & { value: T; user: string })[] {
    const moduleKey = MODULE.path(key);
    return game.settings.storage
        .get("user")
        .filter((setting) => !!setting.user && setting.key === moduleKey);
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

    if (options.scope === "user" && !options.broadcast && options.onChange) {
        const _onChange = options.onChange;
        options.onChange = (value, operation, userId) => {
            if (userId !== game.userId) return;
            _onChange(value, operation, userId);
        };
    }

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

function registerModuleSettings(settings: ModuleSettings) {
    for (const [group, entries] of R.entries(settings)) {
        for (const setting of entries) {
            setting.key = group ? `${group}.${setting.key}` : setting.key;
            registerSetting(setting.key, setting);
        }
    }

    Hooks.on("renderSettingsConfig", (_, html, options: RenderSettingsConfigOptions) =>
        onRenderSettingsConfig(html, options, settings)
    );
}

function onRenderSettingsConfig(
    html: HTMLFormElement,
    options: RenderSettingsConfigOptions,
    settings: ModuleSettings
) {
    const id = MODULE.id;
    const category = options.categories[id];
    if (!category) return;

    const tab = htmlQuery(
        html,
        `[data-application-part="main"] [data-group="categories"][data-tab="${id}"][data-category="${id}"]`
    );

    if (!tab) return;

    const gmOnlyLabel = sharedLocalize("gmOnly");
    const reloadLabel = sharedLocalize("reloadRequired");

    for (const entry of category.entries) {
        if (entry.menu) continue;

        const name = entry.field.name;
        const extras: string[] = [];
        const setting = game.settings.settings.get(name) as RegisterSettingOptions;
        if (!setting) continue;

        if (setting.gmOnly) {
            extras.push(gmOnlyLabel);
        }

        if (setting.requiresReload) {
            extras.push(reloadLabel);
        }

        if (!extras.length) continue;

        const input = htmlQuery(tab, `[name="${name}"]`);
        const group = htmlClosest(input, ".form-group");
        const label = htmlQuery(group, "label");
        const span = createHTMLElement("span", {
            content: ` (${extras.join(", ")})`,
        });

        label?.append(span);
    }

    const settingKeys = R.keys(settings);
    for (let i = 0; i < settingKeys.length; i++) {
        const key = settingKeys[i];
        if (!key) continue;

        const input = htmlQuery(tab, `[name^="${MODULE.id}.${key}"]`);
        const group = htmlClosest(input, ".form-group");
        const title = createHTMLElement("h4", {
            content: localize("settings", key, "title"),
        });

        title.style.marginBlock = i === 0 ? "0" : "0.5em 0em";

        group?.before(title);
    }
}

type ModuleSettings = Record<string, ReadonlyArray<RegisterSettingOptions & { key: string }>>;

type RegisterSettingOptions = Omit<
    SettingRegistration,
    "name" | "scope" | "onChange" | "choices"
> & {
    broadcast?: boolean;
    gmOnly?: boolean;
    name?: string;
    scope: "world" | "user";
    choices?: Record<string, string> | string[];
    onChange?: (value: any, operation: object, userId: string) => void | Promise<void>;
};

type RegisterSettingMenuOptions = PartialExcept<SettingSubmenuConfig, "type" | "restricted">;

type RenderSettingsConfigOptions = {
    categories: Record<string, RenderSettingsConfigCategory>;
};

type RenderSettingsConfigCategory = {
    id: string;
    entries: RenderSettingsConfigCategoryEntry[];
};

type RenderSettingsConfigCategoryEntry = {
    label: string;
} & (
    | {
          menu: true;
          key: string;
      }
    | {
          menu: false;
          field: {
              name: string;
          };
      }
);

export {
    getSetting,
    getUsersSetting,
    hasSetting,
    registerModuleSettings,
    registerSetting,
    registerSettingMenu,
    setSetting,
    settingPath,
    setUserSetting,
};

export type { ModuleSettings, RegisterSettingOptions, RenderSettingsConfigOptions };
