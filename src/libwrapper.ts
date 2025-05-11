import { R } from ".";
import { MODULE } from "./module";

function registerWrapper(
    type: libWrapper.RegisterType,
    path: string | string[],
    callback: libWrapper.RegisterCallback,
    context?: WrapperContext
): number[] {
    const ids: number[] = [];
    const paths = R.isArray(path) ? path : [path];

    const wrapped = context
        ? function (this: any, ...args: any[]) {
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

function unregisterWrapper(id: number | number[]) {
    const ids = R.isArray(id) ? id : [id];

    for (const id of ids) {
        libWrapper.unregister(MODULE.id, id);
    }
}

function createToggleableWrapper(
    type: libWrapper.RegisterType,
    path: string | string[],
    callback: libWrapper.RegisterCallback,
    options: WrapperOptions = {}
): Wrapper {
    let wrapperIds: number[] | null = null;

    return {
        get enabled(): boolean {
            return !!wrapperIds;
        },
        activate() {
            if (this.enabled) return;

            wrapperIds = registerWrapper(type, path, callback, options.context);
            options.onActivate?.();
        },
        disable() {
            if (!wrapperIds) return;

            unregisterWrapper(wrapperIds);
            wrapperIds = null;
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

function activateWrappers(wrappers: Wrapper[]) {
    for (const wrapper of wrappers) {
        wrapper.activate();
    }
}

function disableWrappers(wrappers: Wrapper[]) {
    for (const wrapper of wrappers) {
        wrapper.disable();
    }
}

function toggleWrappers(wrappers: Wrapper[], enabled?: boolean) {
    for (const wrapper of wrappers) {
        wrapper.toggle(enabled);
    }
}

type Wrapper = {
    get enabled(): boolean;
    activate(): void;
    disable(): void;
    toggle(enabled?: boolean): void;
};

type WrapperOptions = {
    context?: WrapperContext;
    onDisable?: () => void;
    onActivate?: () => void;
};

type WrapperContext = InstanceType<new (...args: any[]) => any>;

export {
    activateWrappers,
    createToggleableWrapper,
    disableWrappers,
    registerWrapper,
    toggleWrappers,
    unregisterWrapper,
};
