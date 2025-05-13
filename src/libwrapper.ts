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

function createSharedWrapper<T extends ClientDocument>(
    type: Exclude<libWrapper.RegisterType, "OVERRIDE">,
    path: string,
    sharedCallback: (
        this: T,
        registered: (() => void)[],
        wrapped: libWrapper.RegisterCallback
    ) => void
) {
    let sharedId: number[] | null = null;
    const _registered = new Collection<SharedRegistered>();

    function wrapper(this: T, wrapped: libWrapper.RegisterCallback, ...args: any[]) {
        const registered = R.pipe(
            _registered.contents,
            R.sortBy(R.prop("priority")),
            R.filter(({ active }) => active),
            R.map(({ listener, context }) => () => {
                if (context) {
                    listener.call(context, this, ...args);
                } else {
                    listener.call(this, ...args);
                }
            })
        );

        sharedCallback.call(this, registered, () => wrapped(...args));
    }

    const wrapperIsEnabled = () => {
        return _registered.some((x) => x.active);
    };

    const activateWrapper = (id: string) => {
        const registered = _registered.get(id);
        if (!registered) return;

        if (!sharedId) {
            sharedId = registerWrapper(type, path, wrapper);
        }

        registered.active = true;
    };

    const disableWrapper = (id: string) => {
        const registered = _registered.get(id);
        if (!registered) return;

        registered.active = false;

        if (sharedId && !wrapperIsEnabled()) {
            unregisterWrapper(sharedId);
            sharedId = null;
        }
    };

    return {
        register(
            listener: libWrapper.RegisterCallback,
            { context, priority = 0 }: { context?: WrapperContext; priority?: number } = {}
        ) {
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
                toggle(enabled?: boolean) {
                    enabled ??= !this.enabled;

                    if (enabled) {
                        this.activate();
                    } else {
                        this.disable();
                    }
                },
            };
        },
    };
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

type SharedRegistered = {
    listener: libWrapper.RegisterCallback;
    context?: WrapperContext;
    priority: number;
    active: boolean;
};

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
    createSharedWrapper,
    createToggleableWrapper,
    disableWrappers,
    registerWrapper,
    toggleWrappers,
    unregisterWrapper,
};
