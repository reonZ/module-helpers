function registerUpstreamHook(event: string, listener: HookCallback<any>) {
    const id = Hooks.on(event, listener);
    const index = Hooks.events[event].findIndex((x) => x.id === id);

    if (index > 0) {
        const [hooked] = Hooks.events[event].splice(index, 1);
        Hooks.events[event].unshift(hooked);
    }

    return id;
}

function createHook(hooks: string | string[], listener: HookCallback<any>) {
    const hookIds: { id: number; hook: string }[] = [];
    hooks = Array.isArray(hooks) ? hooks : [hooks];

    return {
        activate() {
            if (hookIds.length) return;
            for (const hook of hooks) {
                const id = Hooks.on(hook, listener);
                hookIds.push({ id, hook });
            }
        },
        disable() {
            if (!hookIds.length) return;
            for (const { hook, id } of hookIds) {
                Hooks.off(hook, id);
            }
            hookIds.length = 0;
        },
        toggle(enabled: boolean) {
            if (enabled) this.activate();
            else this.disable();
        },
    };
}

function runWhenReady(fn: () => void) {
    if (game.ready) fn();
    else Hooks.once("ready", fn);
}

type Hook = {
    activate(): void;
    disable(): void;
    toggle(enabled: boolean): void;
};

export type { Hook };
export { createHook, registerUpstreamHook, runWhenReady };
