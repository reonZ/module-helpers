declare function getSetting(key: "__migrationSchema"): number;
declare function getSetting<T = boolean>(key: string): T;
declare function setSetting(key: "__migrationSchema", value: number): Promise<number>;
declare function setSetting<TSetting>(key: string, value: TSetting): Promise<TSetting>;
declare function hasSetting(key: string): boolean;
declare function registerSetting(key: string, options: RegisterSettingOptions): void;
declare function registerSettingMenu(key: string, options: RegisterSettingMenuOptions): void;
type RegisterSettingOptions = Omit<SettingRegistration, "name" | "scope"> & {
    gmOnly?: boolean;
    name?: string;
    scope: "client" | "world";
};
type RegisterSettingMenuOptions = PartialExcept<SettingSubmenuConfig, "type" | "restricted">;
export { getSetting, hasSetting, registerSetting, registerSettingMenu, setSetting };
