function registerUpstreamHook(event: string, listener: RegisterHookCallback, once?: boolean) {
    const id = Hooks[once ? "once" : "on"](event, listener);
    const hook = Hooks.events[event].findSplice((x) => x.id === id);

    if (hook) {
        Hooks.events[event].unshift(hook);
    }

    return id;
}

function createHook(
    hook: string | string[],
    listener: RegisterHookCallback,
    options: HookOptions = {}
): PersistentHook {
    const _ids: { id: number; path: string }[] = [];
    const _hook = Array.isArray(hook) ? hook : [hook];

    return {
        get enabled(): boolean {
            return _ids.length > 0;
        },
        activate() {
            if (this.enabled) return;

            for (const path of _hook) {
                const id = options.upstream
                    ? registerUpstreamHook(path, listener)
                    : Hooks.on(path, listener);

                _ids.push({ id, path });
            }

            options.onActivate?.();
        },
        disable() {
            if (!this.enabled) return;

            for (const { path, id } of _ids) {
                Hooks.off(path, id);
            }

            _ids.length = 0;

            options.onDisable?.();
        },
        toggle(enabled?: boolean) {
            enabled ??= !this.enabled;

            if (enabled) {
                this.activate();
            } else {
                this.disable();
            }
        },
    };
}

function createHookList(
    hooks: { path: string | string[]; listener: RegisterHookCallback }[]
): PersistentHook {
    let _active = false;
    const _hooks = hooks.map(({ path, listener }) => createHook(path, listener));

    return {
        get enabled(): boolean {
            return _active;
        },
        activate() {
            if (this.enabled) return;
            _active = true;

            for (const hook of _hooks) {
                hook.activate();
            }
        },
        disable() {
            if (!this.enabled) return;
            _active = false;

            for (const hook of _hooks) {
                hook.disable();
            }
        },
        toggle(enabled?: boolean) {
            enabled ??= !this.enabled;

            if (enabled) {
                this.activate();
            } else {
                this.disable();
            }
        },
    };
}

function executeWhenReady(fn: () => void) {
    if (game.ready) {
        fn();
    } else {
        Hooks.once("ready", fn);
    }
}

type PersistentHook = {
    get enabled(): boolean;
    activate(): void;
    disable(): void;
    toggle(enabled?: boolean): void;
};

type RegisterHookCallback = (...args: any[]) => any;

type HookOptions = {
    onDisable?: () => void;
    onActivate?: () => void;
    upstream?: boolean;
};

export { createHook, createHookList, executeWhenReady, registerUpstreamHook };
export type { HookOptions, PersistentHook };
