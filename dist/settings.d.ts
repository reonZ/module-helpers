declare function settingPath(...path: string[]): string;
declare function getSetting<T = boolean>(key: string): T;
declare function setSetting(key: string, value: any): Promise<any>;
declare function hasSetting(key: string): boolean;
declare function registerSetting(options: SettingOptions): void;
declare function registerSettingMenu(options: MenuSettingOptions): void;
export { getSetting, hasSetting, registerSettingMenu, registerSetting, setSetting, settingPath };
