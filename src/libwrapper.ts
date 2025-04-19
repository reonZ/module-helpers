import { R } from ".";
import { MODULE } from "./module";

function registerWrapper(
    type: "OVERRIDE",
    path: string | string[],
    callback: libWrapper.RegisterOverrideCallback,
    context?: WrapperContext
): number[];
function registerWrapper(
    type: "WRAPPER" | "MIXED",
    path: string | string[],
    callback: libWrapper.RegisterWrapperCallback,
    context?: WrapperContext
): number[];
function registerWrapper(
    type: libWrapper.RegisterType,
    path: string | string[],
    callback: libWrapper.RegisterCallback,
    context?: WrapperContext
): number[];
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

function createToggleableWrapper<TPath extends string | string[]>(
    type: "OVERRIDE",
    path: TPath,
    callback: libWrapper.RegisterOverrideCallback,
    options: WrapperOptions
): Wrapper;
function createToggleableWrapper<TPath extends string | string[]>(
    type: "WRAPPER" | "MIXED",
    path: TPath,
    callback: libWrapper.RegisterWrapperCallback,
    options: WrapperOptions
): Wrapper;
function createToggleableWrapper(
    type: libWrapper.RegisterType,
    path: string | string[],
    callback: libWrapper.RegisterCallback,
    options: WrapperOptions = {}
): Wrapper {
    let wrapperIds: number[] | null = null;

    return {
        activate() {
            if (wrapperIds) return;

            wrapperIds = registerWrapper(type, path, callback, options.context);
            options.onActivate?.();
        },
        disable() {
            if (!wrapperIds) return;

            unregisterWrapper(wrapperIds);
            wrapperIds = null;
            options.onDisable?.();
        },
        toggle(enabled: boolean = !wrapperIds) {
            if (enabled) {
                this.activate();
            } else {
                this.disable();
            }
        },
    };
}

type Wrapper = {
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

export { createToggleableWrapper, registerWrapper, unregisterWrapper };
