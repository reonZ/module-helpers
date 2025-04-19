function createHook(hook, listener) {
    const _ids = [];
    const _hook = Array.isArray(hook) ? hook : [hook];
    return {
        activate() {
            if (_ids.length)
                return;
            for (const path of _hook) {
                _ids.push({
                    id: Hooks.on(path, listener),
                    path,
                });
            }
        },
        disable() {
            if (!_ids.length)
                return;
            for (const { path, id } of _ids) {
                Hooks.off(path, id);
            }
            _ids.length = 0;
        },
        toggle(enabled = !_ids.length) {
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
        activate() {
            if (_active)
                return;
            _active = true;
            for (const hook of _hooks) {
                hook.activate();
            }
        },
        disable() {
            if (!_active)
                return;
            _active = false;
            for (const hook of _hooks) {
                hook.disable();
            }
        },
        toggle(enabled = !_active) {
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
