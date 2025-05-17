declare function localize(...args: LocalizeArgs): string;
declare function sharedLocalize(key: CollapseOf<LEVIKTIMES>): string;
declare function localizeIfExist(...args: LocalizeArgs): string | undefined;
declare function localizePath(...args: string[]): string;
declare function notify(type: "info" | "warning" | "error", ...args: NotificationArgs): number;
declare function info(...args: NotificationArgs): number;
declare function warning(...args: NotificationArgs): number;
declare function error(...args: NotificationArgs): number;
declare class I18n {
    #private;
    constructor(prefix: string | string[], suffix?: string | string[]);
    static from(i18n: I18nCreateArgs): I18n;
    static from(i18n: I18nCreateArgs | undefined): I18n | undefined;
    clone(prefix?: string | string[], suffix?: string | string[]): I18n;
    addPrefix(prefix: string | string[]): this;
    addSuffix(suffix: string | string[]): this;
    localize(...value: string[]): string;
    localizeIfExist(...value: string[]): string | undefined;
    localizePath(...value: string[]): string;
}
type I18nObject = {
    prefix: string | string[];
    suffix: string | string[];
};
type I18nCreateArgs = string | I18nObject | I18n;
type LocalizeData = Record<string, any>;
type NotificationArgs = LocalizeArgs | [...LocalizeArgs, string | LocalizeData | boolean];
type LocalizeArgs = string[] | [...string[], string | LocalizeData];
export { error, I18n, info, localize, localizeIfExist, localizePath, notify, sharedLocalize, warning, };
export type { I18nCreateArgs, LocalizeArgs, LocalizeData };
