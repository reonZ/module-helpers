import { R } from ".";
import { MODULE } from "./module";
function registerWrapper(type, path, callback, context) {
    const ids = [];
    const paths = R.isArray(path) ? path : [path];
    const wrapped = context
        ? function (...args) {
            args.unshift(this);
            callback.apply(context, args);
        }
        : callback;
    for (const key of paths) {
        const id = libWrapper.register(MODULE.id, key, wrapped, type);
        ids.push(id);
    }
    return ids;
}
function unregisterWrapper(id) {
    const ids = R.isArray(id) ? id : [id];
    for (const id of ids) {
        libWrapper.unregister(MODULE.id, id);
    }
}
function createToggleableWrapper(type, path, callback, options = {}) {
    let wrapperIds = null;
    return {
        activate() {
            if (wrapperIds)
                return;
            wrapperIds = registerWrapper(type, path, callback, options.context);
            options.onActivate?.();
        },
        disable() {
            if (!wrapperIds)
                return;
            unregisterWrapper(wrapperIds);
            wrapperIds = null;
            options.onDisable?.();
        },
        toggle(enabled = !wrapperIds) {
            if (enabled) {
                this.activate();
            }
            else {
                this.disable();
            }
        },
    };
}
export { createToggleableWrapper, registerWrapper, unregisterWrapper };
