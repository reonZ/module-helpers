function createHook(hook, listener) {
    const _ids = [];
    const _hook = Array.isArray(hook) ? hook : [hook];
    return {
        get enabled() {
            return _ids.length > 0;
        },
        activate() {
            if (this.enabled)
                return;
            for (const path of _hook) {
                _ids.push({
                    id: Hooks.on(path, listener),
                    path,
                });
            }
        },
        disable() {
            if (!this.enabled)
                return;
            for (const { path, id } of _ids) {
                Hooks.off(path, id);
            }
            _ids.length = 0;
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
function createHookList(hooks) {
    let _active = false;
    const _hooks = hooks.map(({ path, listener }) => createHook(path, listener));
    return {
        get enabled() {
            return _active;
        },
        activate() {
            if (this.enabled)
                return;
            _active = true;
            for (const hook of _hooks) {
                hook.activate();
            }
        },
        disable() {
            if (!this.enabled)
                return;
            _active = false;
            for (const hook of _hooks) {
                hook.disable();
            }
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
function executeWhenReady(fn) {
    if (game.ready) {
        fn();
    }
    else {
        Hooks.once("ready", fn);
    }
}
export { createHook, createHookList, executeWhenReady };
