import { MODULE, R } from ".";

function foundryLocalizeIfExist(key: string): string | undefined {
    if (game.i18n.has(key, true)) {
        return game.i18n.localize(key);
    }
}

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

function notify(type: "info" | "warning" | "error" | "success", ...args: NotificationArgs): Notification {
    const permanent = R.isBoolean(args.at(-1)) ? (args.pop() as boolean) : false;
    const str = localize(...(args as LocalizeArgs));
    return ui.notifications.notify(str, type, { permanent });
}

function success(...args: NotificationArgs): Notification {
    return notify("success", ...args);
}

function info(...args: NotificationArgs): Notification {
    return notify("info", ...args);
}

function warning(...args: NotificationArgs): Notification {
    return notify("warning", ...args);
}

function error(...args: NotificationArgs): Notification {
    return notify("error", ...args);
}

type LocalizeData = Record<string, any>;

type NotificationArgs = LocalizeArgs | [...LocalizeArgs, string | LocalizeData | boolean];

type LocalizeArgs = string[] | [...string[], string | LocalizeData];

export {
    error,
    foundryLocalizeIfExist,
    info,
    localize,
    localizeIfExist,
    localizePath,
    notify,
    sharedLocalize,
    success,
    warning,
};
export type { LocalizeArgs, LocalizeData, NotificationArgs };
