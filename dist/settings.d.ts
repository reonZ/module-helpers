declare function getSetting<T = boolean>(key: string): T;
declare function setSetting<TSetting>(key: string, value: TSetting): Promise<TSetting>;
declare function hasSetting(key: string): boolean;
declare function registerSetting(key: string, options: RegisterSettingOptions): void;
type RegisterSettingOptions = Omit<SettingConfig, "config" | "key" | "namespace" | "name"> & {
    name?: string;
    config?: boolean;
    gmOnly?: boolean;
};
export { getSetting, hasSetting, registerSetting, setSetting };
