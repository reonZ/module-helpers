import { UserPF2e } from "foundry-pf2e";
declare function settingPath(...path: string[]): string;
declare function getSetting(key: "__migrationSchema"): number;
declare function getSetting<T = boolean>(key: string): T;
declare function getUsersSetting<T = boolean>(key: string): (Setting & {
    value: T;
    user: string;
})[];
declare function setSetting(key: "__migrationSchema", value: number): Promise<number>;
declare function setSetting<TSetting>(key: string, value: TSetting): Promise<TSetting>;
/**
 * modified version of
 * client/helpers/client-settings.mjs#266
 */
declare function setUserSetting(user: UserPF2e | string, key: string, value: any): Promise<Setting | undefined>;
declare function hasSetting(key: string): boolean;
declare function registerSetting(key: string, options: RegisterSettingOptions): void;
declare function registerSettingMenu(key: string, options: RegisterSettingMenuOptions): void;
declare function registerModuleSettings(settings: ModuleSettings): void;
type ModuleSettings = Record<string, ReadonlyArray<RegisterSettingOptions & {
    key: string;
}>>;
type RegisterSettingOptions = Omit<SettingRegistration, "name" | "scope" | "onChange"> & {
    gmOnly?: boolean;
    name?: string;
    scope: "world" | "user";
    onChange?: (value: any, operation: object, userId: string) => void | Promise<void>;
};
type RegisterSettingMenuOptions = PartialExcept<SettingSubmenuConfig, "type" | "restricted">;
export { getSetting, getUsersSetting, hasSetting, registerModuleSettings, registerSetting, registerSettingMenu, setSetting, settingPath, setUserSetting, };
export type { ModuleSettings, RegisterSettingOptions };
