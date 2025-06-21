import { getSetting, joinStr, localize, R } from ".";
import * as html from "./html";
const _MODULE = {
    id: "",
    groupLog: false,
    gameContext: "",
    current: undefined,
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
        return (_MODULE.current ??= game.modules.get(this.id));
    },
    get isDebug() {
        return foundry.utils.getProperty(CONFIG, `debug.${this.id}`) === true;
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
        foundry.utils.setProperty(CONFIG, `debug.${this.id}`, true);
        for (const [key, value] of R.entries(_MODULE.expose.debug)) {
            foundry.utils.setProperty(window, key, value);
        }
        foundry.utils.setProperty(window, "R", R);
        foundry.utils.setProperty(window, "debugHTML", html);
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
        Hooks.once("init", () => {
            // @ts-expect-error
            const context = (game[_MODULE.gameContext] ??= {});
            const current = MODULE.current;
            Object.defineProperties(context, {
                active: {
                    get: function () {
                        return current.active;
                    },
                    configurable: false,
                    enumerable: false,
                },
                getSetting: {
                    value: function (setting) {
                        return current.active ? getSetting(setting) : undefined;
                    },
                    writable: false,
                    configurable: false,
                    enumerable: false,
                },
                localize: {
                    value: function (...args) {
                        return localize(...args);
                    },
                    writable: false,
                    configurable: false,
                    enumerable: false,
                },
            });
            for (const type of ["api", "dev"]) {
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
function addGameExpose(type, expose) {
    for (const [key, value] of R.entries(expose)) {
        _MODULE.expose[type][key] = value;
    }
}
let _activeModules = {};
function getActiveModule(name) {
    const exist = _activeModules[name];
    if (exist !== undefined) {
        return exist;
    }
    const module = game.modules.get(name);
    if (!module?.active)
        return;
    module.getSetting = (key) => game.settings.get(name, key);
    module.setSetting = (key, value) => game.settings.set(name, key, value);
    return (_activeModules[name] = module);
}
export { getActiveModule, MODULE };
