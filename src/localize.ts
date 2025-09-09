import { joinStr, MODULE, R } from ".";

function getLocalizeData(...args: LocalizeArgs): { path: string; data?: LocalizeData } {
    const data = R.isObjectType(args.at(-1)) ? (args.pop() as LocalizeData) : undefined;
    const path = localizePath(...(args as string[]));
    return { path, data };
}

function localizeOrFormat(path: string, data?: LocalizeData): string {
    return typeof data === "object" ? game.i18n.format(path, data) : game.i18n.localize(path);
}

function localize(...args: LocalizeArgs): string {
    const { data, path } = getLocalizeData(...args);
    return localizeOrFormat(path, data);
}

function sharedLocalize(key: CollapseOf<LEVIKTIMES>): string {
    return game.i18n.localize(`LEVIKTIMES.${key}`);
}

function localizeIfExist(...args: LocalizeArgs) {
    const { data, path } = getLocalizeData(...args);
    if (game.i18n.has(path, true)) {
        return localizeOrFormat(path, data);
    }
}

function localizePath(...path: string[]): string {
    return MODULE.path(...path);
}

function notify(type: "info" | "warning" | "error" | "success", ...args: NotificationArgs): number {
    const permanent = R.isBoolean(args.at(-1)) ? (args.pop() as boolean) : false;
    const str = localize(...(args as LocalizeArgs));
    return ui.notifications.notify(str, type, { permanent }).id;
}

function success(...args: NotificationArgs) {
    return notify("success", ...args);
}

function info(...args: NotificationArgs): number {
    return notify("info", ...args);
}

function warning(...args: NotificationArgs): number {
    return notify("warning", ...args);
}

function error(...args: NotificationArgs): number {
    return notify("error", ...args);
}

class I18n {
    #prefix: string;
    #suffix: string | undefined;

    constructor(prefix: string | string[], suffix?: string | string[]) {
        this.#prefix = joinStr(".", prefix);
        this.#suffix = suffix ? joinStr(".", suffix) : undefined;
    }

    static from(i18n: I18nCreateArgs): I18n;
    static from(i18n: I18nCreateArgs | undefined): I18n | undefined;
    static from(i18n: I18nCreateArgs | undefined) {
        return i18n instanceof I18n
            ? i18n
            : R.isString(i18n)
            ? new I18n(i18n)
            : R.isObjectType(i18n)
            ? new I18n(i18n.prefix, i18n.suffix)
            : i18n;
    }

    clone(prefix?: string | string[], suffix?: string | string[]): I18n {
        const prefixes = joinStr(".", this.#prefix, prefix);
        const suffixes = joinStr(".", this.#suffix, suffix);
        return new I18n(prefixes, suffixes);
    }

    addPrefix(prefix: string | string[]): this {
        this.#prefix = joinStr(".", this.#prefix, prefix);
        return this;
    }

    addSuffix(suffix: string | string[]): this {
        this.#suffix ??= joinStr(".", this.#suffix, suffix);
        return this;
    }

    localize(...value: string[]): string {
        const path = this.localizePath(...value);
        return game.i18n.localize(path);
    }

    localizeIfExist(...value: string[]): string | undefined {
        const path = this.localizePath(...value);
        if (game.i18n.has(path, true)) {
            return game.i18n.localize(path);
        }
    }

    localizePath(...value: string[]): string {
        if (this.#suffix) {
            return localizePath(this.#prefix, ...value, this.#suffix);
        } else {
            return localizePath(this.#prefix, ...value);
        }
    }
}

type I18nObject = { prefix: string | string[]; suffix: string | string[] };

type I18nCreateArgs = string | I18nObject | I18n;

type LocalizeData = Record<string, any>;

type NotificationArgs = LocalizeArgs | [...LocalizeArgs, string | LocalizeData | boolean];

type LocalizeArgs = string[] | [...string[], string | LocalizeData];

export {
    error,
    I18n,
    info,
    localize,
    localizeIfExist,
    localizePath,
    notify,
    sharedLocalize,
    success,
    warning,
};
export type { I18nCreateArgs, LocalizeArgs, LocalizeData, NotificationArgs };
