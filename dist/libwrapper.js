import { MODULE } from "./module";
function registerWrapper(path, callback, type, context) {
    const ids = [];
    const paths = Array.isArray(path) ? path : [path];
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
    // @ts-ignore
    return ids.length === 1 ? ids[0] : ids;
}
function unregisterWrapper(id) {
    libWrapper.unregister(MODULE.id, id);
}
function createWrapper(path, callback, options = {}) {
    let wrapperId = null;
    return {
        activate() {
            if (wrapperId !== null)
                return;
            wrapperId = registerWrapper(path, callback, options.type ?? "WRAPPER", options.context);
            options.onActivate?.();
        },
        disable() {
            if (wrapperId === null)
                return;
            unregisterWrapper(wrapperId);
            wrapperId = null;
            options.onDisable?.();
        },
        toggle(enabled) {
            if (enabled)
                this.activate();
            else
                this.disable();
        },
    };
}
function wrapperError(path, error) {
    MODULE.error(`an error occured in the wrapper\n${path}`, error);
}
export { createWrapper, registerWrapper, unregisterWrapper, wrapperError };
