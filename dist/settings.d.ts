declare function addExtraInfoToSettingLabel(setting: SettingOptions | SettingConfig, group: HTMLElement): void;
declare function settingPath(...path: string[]): string;
declare function getSetting<T = boolean>(key: string): T;
declare function setSetting<TSetting>(key: string, value: TSetting): Promise<TSetting>;
declare function hasSetting(key: string): boolean;
declare function registerSetting(options: SettingOptions): void;
declare function registerSettingMenu(options: MenuSettingOptions): void;
export { addExtraInfoToSettingLabel, getSetting, hasSetting, registerSettingMenu, registerSetting, setSetting, settingPath, };
