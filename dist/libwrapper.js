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
function createSharedWrapper(type, path, sharedCallback) {
    let sharedId = null;
    const _registered = new Collection();
    function wrapper(wrapped, ...args) {
        const registered = R.pipe(_registered.contents, R.sortBy(R.prop("priority")), R.filter(({ active }) => active), R.map(({ listener, context }) => () => {
            if (context) {
                return listener.call(context, this, ...args);
            }
            else {
                return listener.call(this, ...args);
            }
        }));
        sharedCallback.call(this, registered, () => wrapped(...args));
    }
    const wrapperIsEnabled = () => {
        return _registered.some((x) => x.active);
    };
    const activateWrapper = (id) => {
        const registered = _registered.get(id);
        if (!registered)
            return;
        if (!sharedId) {
            sharedId = registerWrapper(type, path, wrapper);
        }
        registered.active = true;
    };
    const disableWrapper = (id) => {
        const registered = _registered.get(id);
        if (!registered)
            return;
        registered.active = false;
        if (sharedId && !wrapperIsEnabled()) {
            unregisterWrapper(sharedId);
            sharedId = null;
        }
    };
    function register(listener, { context, priority = 0 } = {}) {
        const registerId = foundry.utils.randomID();
        _registered.set(registerId, {
            listener,
            context,
            priority,
            active: false,
        });
        return {
            get enabled() {
                return !!_registered.get(registerId)?.active;
            },
            activate() {
                activateWrapper(registerId);
            },
            disable() {
                disableWrapper(registerId);
            },
            toggle(enabled) {
                enabled ??= !this.enabled;
                if (enabled) {
                    this.activate();
                }
                else {
                    this.disable();
                }
            },
        };
    }
    return {
        register,
    };
}
function createToggleableWrapper(type, path, callback, options = {}) {
    let wrapperIds = null;
    return {
        get enabled() {
            return !!wrapperIds;
        },
        activate() {
            if (this.enabled)
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
        toggle(enabled) {
            enabled ??= !this.enabled;
            if (enabled) {
                this.activate();
            }
            else {
                this.disable();
            }
        },
    };
}
export { createSharedWrapper, createToggleableWrapper, registerWrapper, unregisterWrapper };
