import { getSetting, joinStr, R } from ".";

const _MODULE = {
    id: "",
    groupLog: false,
    gameContext: "",
    current: undefined as Module | undefined,
    expose: {
        api: {},
        debug: {},
        dev: {},
    } as ModuleExposed,
};

const MODULE = {
    get id(): string {
        if (!_MODULE.id) {
            throw new Error("Module needs to be registered.");
        }
        return _MODULE.id;
    },
    get name(): string {
        if (!_MODULE.id) {
            throw new Error("Module needs to be registered.");
        }
        return this.current.title;
    },
    get current(): Module {
        return (_MODULE.current ??= game.modules.get(this.id) as Module);
    },
    get isDebug(): boolean {
        // @ts-expect-error
        return CONFIG.debug.modules === true;
    },
    Error(str: string): Error {
        return new Error(`\n[${this.name}] ${str}`);
    },
    error(str: string, error?: Error) {
        let message = `[${this.name}] ${str}`;

        if (error instanceof Error) {
            message += `\n${error.message}`;
        } else if (typeof error === "string") {
            message += `\n${error}`;
        }

        console.error(message);
    },
    log(...args: any[]) {
        if (_MODULE.groupLog) {
            console.log(...args);
        } else {
            console.log(`[${this.name}]`, ...args);
        }
    },
    group(label: string) {
        this.groupEnd();
        _MODULE.groupLog = true;
        console.group(`[${this.name}] ${label}`);
    },
    groupEnd() {
        console.groupEnd();
        _MODULE.groupLog = false;
    },
    debug(...args: any[]) {
        if (this.isDebug) {
            this.log(...args);
        }
    },
    debugExpose(expose: Record<string, any>) {
        const isDebug = this.isDebug;

        for (const [k, v] of R.entries(expose)) {
            _MODULE.expose.debug[k] = v;

            if (isDebug) {
                // @ts-expect-error
                window[k] = v;
            }
        }
    },
    apiExpose(expose: Record<string, any>) {
        addGameExpose("api", expose);
    },
    devExpose(expose: Record<string, any>) {
        addGameExpose("dev", expose);
    },
    enableDebugMode() {
        if (this.isDebug) return;

        // @ts-expect-error
        CONFIG.debug.modules = true;

        for (const [key, value] of R.entries(_MODULE.expose.debug)) {
            // @ts-expect-error
            window[key] = value;
        }

        // @ts-expect-error
        window.R = R;
    },
    path(...path: (string | string[])[]): string {
        const joined = joinStr(".", ...path);
        return joined ? `${this.id}.${joined}` : `${this.id}`;
    },
    register(id: string, options: ModuleRegisterOptions = {}) {
        if (_MODULE.id) {
            throw new Error("Module was already registered.");
        }

        _MODULE.id = id;
        _MODULE.gameContext = options.game ?? id.replace(/^pf2e-/, "");

        Hooks.once("init", () => {
            // @ts-expect-error
            const context = (game[_MODULE.gameContext] ??= {});
            const current = MODULE.current;

            Object.defineProperties(context, {
                active: {
                    get: function () {
                        return MODULE.current.active;
                    },
                    configurable: false,
                    enumerable: false,
                },
                getSetting: {
                    value: function (setting: string) {
                        return MODULE.current.active ? getSetting(setting) : undefined;
                    },
                    writable: false,
                    configurable: false,
                    enumerable: false,
                },
            });

            for (const type of ["api", "dev"] as const) {
                Object.defineProperty(current, type, {
                    value: _MODULE.expose[type],
                    writable: false,
                    configurable: false,
                    enumerable: false,
                });

                Object.defineProperty(context, type, {
                    value: _MODULE.expose[type],
                    writable: false,
                    configurable: false,
                    enumerable: false,
                });
            }
        });
    },
};

function addGameExpose(type: "api" | "dev", expose: Record<string, any>) {
    for (const [key, value] of R.entries(expose)) {
        _MODULE.expose[type][key] = value;
    }
}

type ModuleExposed = Record<"api" | "debug" | "dev", Record<string, any>>;

type ModuleRegisterOptions = {
    game?: string;
};

export { MODULE };
