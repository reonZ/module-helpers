import { joinStr, MODULE, R } from ".";
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
class I18n {
    #prefix;
    #suffix;
    constructor(prefix, suffix) {
        this.#prefix = joinStr(".", prefix);
        this.#suffix = suffix ? joinStr(".", suffix) : undefined;
    }
    static from(i18n) {
        return i18n instanceof I18n
            ? i18n
            : R.isString(i18n)
                ? new I18n(i18n)
                : R.isObjectType(i18n)
                    ? new I18n(i18n.prefix, i18n.suffix)
                    : i18n;
    }
    clone(prefix, suffix) {
        const prefixes = joinStr(".", this.#prefix, prefix);
        const suffixes = joinStr(".", this.#suffix, suffix);
        return new I18n(prefixes, suffixes);
    }
    addPrefix(prefix) {
        this.#prefix = joinStr(".", this.#prefix, prefix);
        return this;
    }
    addSuffix(suffix) {
        this.#suffix ??= joinStr(".", this.#suffix, suffix);
        return this;
    }
    localize(...value) {
        const path = this.localizePath(...value);
        return game.i18n.localize(path);
    }
    localizeIfExist(...value) {
        const path = this.localizePath(...value);
        if (game.i18n.has(path, true)) {
            return game.i18n.localize(path);
        }
    }
    localizePath(...value) {
        if (this.#suffix) {
            return localizePath(this.#prefix, ...value, this.#suffix);
        }
        else {
            return localizePath(this.#prefix, ...value);
        }
    }
}
export { error, I18n, info, localize, localizeIfExist, localizePath, notify, sharedLocalize, success, warning, };
