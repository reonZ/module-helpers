import { MODULE, R } from ".";
function localize(...args) {
    const data = R.isPlainObject(args.at(-1)) ? args.pop() : undefined;
    const path = localizePath(...args);
    if (typeof data === "object") {
        return game.i18n.format(path, data);
    }
    return game.i18n.localize(path);
}
function localizePath(...args) {
    return MODULE.path(...args);
}
function notify(type, ...args) {
    const permanent = R.isBoolean(args.at(-1)) ? args.pop() : false;
    const str = localize(args);
    return ui.notifications.notify(str, type, { permanent });
}
function info(...args) {
    return notify("info", ...args);
}
function warning(...args) {
    return notify("warning", ...args);
}
function error(...args) {
    return notify("error", ...args);
}
export { error, info, localize, localizePath, notify, warning };
