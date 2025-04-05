declare function localize(...args: LocalizeArgs): string;
declare function localizePath(...args: string[]): string;
declare function notify(type: "info" | "warning" | "error", ...args: NotificationArgs): number;
declare function info(...args: NotificationArgs): number;
declare function warning(...args: NotificationArgs): number;
declare function error(...args: NotificationArgs): number;
type LocalizeData = Record<string, any>;
type NotificationArgs = [...string[], string | LocalizeData] | [...string[], string | LocalizeData, string | LocalizeData | boolean];
type LocalizeArgs = [...string[], string | LocalizeData];
export { error, info, localize, localizePath, notify, warning };
export type { LocalizeArgs, LocalizeData };
