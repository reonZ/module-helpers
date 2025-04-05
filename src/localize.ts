import { MODULE, R } from ".";

function localize(...args: LocalizeArgs): string {
    const data = R.isPlainObject(args.at(-1)) ? (args.pop() as LocalizeData) : undefined;
    const path = localizePath(...(args as string[]));

    if (typeof data === "object") {
        return game.i18n.format(path, data);
    }

    return game.i18n.localize(path);
}

function localizePath(...args: string[]): string {
    return MODULE.path(...args);
}

function notify(type: "info" | "warning" | "error", ...args: NotificationArgs): number {
    const permanent = R.isBoolean(args.at(-1)) ? (args.pop() as boolean) : false;
    const str = localize(args);
    return ui.notifications.notify(str, type, { permanent });
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

type LocalizeData = Record<string, any>;

type NotificationArgs =
    | [...string[], string | LocalizeData]
    | [...string[], string | LocalizeData, string | LocalizeData | boolean];

type LocalizeArgs = [...string[], string | LocalizeData];

export { error, info, localize, localizePath, notify, warning };
export type { LocalizeArgs, LocalizeData };
