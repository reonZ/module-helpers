import type { ModuleMigrations } from ".";
import { joinStr, R, registerMigrations } from ".";

let MODULE_ID = "";
let GAME_CONTEXT = "";
let EXPOSE: Record<"api" | "debug" | "dev", Record<string, any>> = {
    api: {},
    debug: {},
    dev: {},
};

const MODULE = {
    get id(): string {
        if (!MODULE_ID) {
            throw new Error("Module needs to be registered.");
        }
        return MODULE_ID;
    },
    get name(): string {
        if (!MODULE_ID) {
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
        return GAME_CONTEXT;
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
        console.log(`[${this.name}]`, ...args);
    },
    debug(...args: any[]) {
        if (this.isDebug) {
            this.log(...args);
        }
    },
    debugExpose(expose: Record<string, any>) {
        const isDebug = this.isDebug;

        for (const [k, v] of R.entries(expose)) {
            EXPOSE.debug[k] = v;

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

        for (const [key, value] of R.entries(EXPOSE.debug)) {
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
        if (MODULE_ID) {
            throw new Error("Module was already registered.");
        }

        MODULE_ID = id;
        GAME_CONTEXT = options.game ?? id.replace(/^pf2e-/, "");

        registerMigrations(options.migrations);

        Hooks.once("ready", () => {
            for (const type of ["api", "dev"] as const) {
                for (const key of R.keys(EXPOSE[type])) {
                    gameExpose(type, key);
                }
            }
        });
    },
};

function addGameExpose(type: "api" | "dev", expose: Record<string, any>) {
    const isReady = game.ready;

    for (const [key, value] of R.entries(expose)) {
        EXPOSE[type][key] = value;

        if (isReady) {
            gameExpose(type, key);
        }
    }
}

function gameExpose(type: "api" | "dev", key: string) {
    foundry.utils.setProperty(game, `${GAME_CONTEXT}.${type}.${key}`, EXPOSE[type][key]);
}

type ModuleRegisterOptions = {
    game?: string;
    migrations?: ModuleMigrations;
};

export { MODULE };
