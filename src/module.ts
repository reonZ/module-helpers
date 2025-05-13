import { joinStr, R } from ".";

const _MODULE = {
    id: "",
    groupLog: false,
    gameContext: "",
    expose: {
        api: {},
        debug: {},
        dev: {},
    } as Record<"api" | "debug" | "dev", Record<string, any>>,
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
    get current() {
        return game.modules.get(this.id) as Module & { api?: Record<string, any> };
    },
    get isDebug(): boolean {
        // @ts-expect-error
        return CONFIG.debug.modules === true;
    },
    get gameContext(): string {
        return _MODULE.gameContext;
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

        Hooks.once("ready", () => {
            for (const type of ["api", "dev"] as const) {
                for (const key of R.keys(_MODULE.expose[type])) {
                    gameExpose(type, key);
                }
            }
        });
    },
};

function addGameExpose(type: "api" | "dev", expose: Record<string, any>) {
    const isReady = game.ready;

    for (const [key, value] of R.entries(expose)) {
        _MODULE.expose[type][key] = value;

        if (isReady) {
            gameExpose(type, key);
        }
    }
}

function gameExpose(type: "api" | "dev", key: string) {
    foundry.utils.setProperty(
        game,
        `${_MODULE.gameContext}.${type}.${key}`,
        _MODULE.expose[type][key]
    );
}

type ModuleRegisterOptions = {
    game?: string;
};

export { MODULE };
