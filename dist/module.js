import { joinStr, R, registerMigrations, registerModuleSettings } from ".";
const _MODULE = {
    id: "",
    groupLog: false,
    gameContext: "",
    expose: {
        api: {},
        debug: {},
        dev: {},
    },
};
const MODULE = {
    get id() {
        if (!_MODULE.id) {
            throw new Error("Module needs to be registered.");
        }
        return _MODULE.id;
    },
    get name() {
        if (!_MODULE.id) {
            throw new Error("Module needs to be registered.");
        }
        return this.current.title;
    },
    get current() {
        return game.modules.get(this.id);
    },
    get isDebug() {
        // @ts-expect-error
        return CONFIG.debug.modules === true;
    },
    get gameContext() {
        return _MODULE.gameContext;
    },
    Error(str) {
        return new Error(`\n[${this.name}] ${str}`);
    },
    error(str, error) {
        let message = `[${this.name}] ${str}`;
        if (error instanceof Error) {
            message += `\n${error.message}`;
        }
        else if (typeof error === "string") {
            message += `\n${error}`;
        }
        console.error(message);
    },
    log(...args) {
        if (_MODULE.groupLog) {
            console.log(...args);
        }
        else {
            console.log(`[${this.name}]`, ...args);
        }
    },
    group(label) {
        this.groupEnd();
        _MODULE.groupLog = true;
        console.group(`[${this.name}] ${label}`);
    },
    groupEnd() {
        console.groupEnd();
        _MODULE.groupLog = false;
    },
    debug(...args) {
        if (this.isDebug) {
            this.log(...args);
        }
    },
    debugExpose(expose) {
        const isDebug = this.isDebug;
        for (const [k, v] of R.entries(expose)) {
            _MODULE.expose.debug[k] = v;
            if (isDebug) {
                // @ts-expect-error
                window[k] = v;
            }
        }
    },
    apiExpose(expose) {
        addGameExpose("api", expose);
    },
    devExpose(expose) {
        addGameExpose("dev", expose);
    },
    enableDebugMode() {
        if (this.isDebug)
            return;
        // @ts-expect-error
        CONFIG.debug.modules = true;
        for (const [key, value] of R.entries(_MODULE.expose.debug)) {
            // @ts-expect-error
            window[key] = value;
        }
        // @ts-expect-error
        window.R = R;
    },
    path(...path) {
        const joined = joinStr(".", ...path);
        return joined ? `${this.id}.${joined}` : `${this.id}`;
    },
    register(id, options = {}) {
        if (_MODULE.id) {
            throw new Error("Module was already registered.");
        }
        _MODULE.id = id;
        _MODULE.gameContext = options.game ?? id.replace(/^pf2e-/, "");
        registerMigrations(options.migrations);
        Hooks.once("init", () => {
            if (options.settings) {
                registerModuleSettings(options.settings);
            }
        });
        Hooks.once("ready", () => {
            for (const type of ["api", "dev"]) {
                for (const key of R.keys(_MODULE.expose[type])) {
                    gameExpose(type, key);
                }
            }
        });
    },
};
function addGameExpose(type, expose) {
    const isReady = game.ready;
    for (const [key, value] of R.entries(expose)) {
        _MODULE.expose[type][key] = value;
        if (isReady) {
            gameExpose(type, key);
        }
    }
}
function gameExpose(type, key) {
    foundry.utils.setProperty(game, `${_MODULE.gameContext}.${type}.${key}`, _MODULE.expose[type][key]);
}
export { MODULE };
