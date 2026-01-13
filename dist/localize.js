import { MODULE, R } from ".";
function foundryLocalizeIfExist(key) {
    if (game.i18n.has(key, true)) {
        return game.i18n.localize(key);
    }
}
function getLocalizeData(...args) {
    const data = R.isObjectType(args.at(-1)) ? args.pop() : undefined;
    const path = localizePath(...args);
    return { path, data };
}
function localizeOrFormat(path, data) {
    return typeof data === "object" ? game.i18n.format(path, data) : game.i18n.localize(path);
}
function localize(...args) {
    const { data, path } = getLocalizeData(...args);
    return localizeOrFormat(path, data);
}
function sharedLocalize(key) {
    return game.i18n.localize(`LEVIKTIMES.${key}`);
}
function localizeIfExist(...args) {
    const { data, path } = getLocalizeData(...args);
    if (game.i18n.has(path, true)) {
        return localizeOrFormat(path, data);
    }
}
function localizePath(...path) {
    return MODULE.path(...path);
}
function notify(type, ...args) {
    const permanent = R.isBoolean(args.at(-1)) ? args.pop() : false;
    const str = localize(...args);
    return ui.notifications.notify(str, type, { permanent });
}
function success(...args) {
    return notify("success", ...args);
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
export { error, foundryLocalizeIfExist, info, localize, localizeIfExist, localizePath, notify, sharedLocalize, success, warning, };
