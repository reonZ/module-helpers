import { UserPF2e } from "foundry-pf2e";
declare function getSetting(key: "__migrationSchema"): number;
declare function getSetting<T = boolean>(key: string): T;
declare function getUsersSetting<T = boolean>(key: string): T[];
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
type ModuleSettings = Record<string, ReadonlyArray<RegisterSettingOptions>> | ReadonlyArray<RegisterSettingOptions>;
type RegisterSettingOptions = Omit<SettingRegistration, "name" | "scope"> & {
    gmOnly?: boolean;
    name?: string;
    key: string;
    scope: "client" | "world" | "user";
};
type RegisterSettingMenuOptions = PartialExcept<SettingSubmenuConfig, "type" | "restricted">;
export { getSetting, getUsersSetting, hasSetting, registerModuleSettings, registerSetting, registerSettingMenu, setSetting, setUserSetting, };
export type { ModuleSettings, RegisterSettingOptions };
