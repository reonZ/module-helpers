import { MODULE } from "./module";
type NotificationData = Record<string, string | number | boolean>;
declare function warn(str: string, arg1?: NotificationData | boolean, arg2?: boolean): void;
declare function info(str: string, arg1?: NotificationData | boolean, arg2?: boolean): void;
declare function error(str: string, arg1?: NotificationData | boolean, arg2?: boolean): void;
declare function localize(...args: LocalizeArgs): string;
declare function templateLocalize(subKey: string): (key: string, { hash }: {
    hash: Record<string, string>;
}) => string;
declare function localeCompare(a: string, b: string): number;
declare function sortByLocaleCompare<T extends Record<string, any>>(list: Array<T>, key: keyof T): void;
declare function hasLocalization(...path: string[]): boolean;
declare function localizeIfExist(...args: LocalizeArgs): string | undefined;
declare function subLocalize(subKey: string): typeof localize & {
    ifExist: typeof localizeIfExist;
    has: typeof hasLocalization;
    path: typeof MODULE.path;
    warn: typeof warn;
    info: typeof info;
    error: typeof error;
    i18n: TemplateLocalize;
    sub: typeof subLocalize;
};
type LocalizeArgs = [...string[], string | Record<string, any>];
type TemplateLocalize = ReturnType<typeof templateLocalize>;
export type { TemplateLocalize };
export { error, hasLocalization, info, localeCompare, localize, localizeIfExist, sortByLocaleCompare, subLocalize, templateLocalize, warn, };
