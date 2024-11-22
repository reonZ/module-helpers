declare const MODULE: {
    readonly id: string;
    readonly name: string;
    readonly current: Module;
    throwError(str: string): never;
    error(str: string, error?: Error): void;
    log(str: string): void;
    path(...path: (string | string[])[]): `${string}.${string}`;
    register(id: string, name: string): void;
};
declare function getActiveModule(name: "dice-so-nice"): ExtendedModule<DiseSoNiceModule> | undefined;
declare function getActiveModule(name: "pf2e-toolbelt"): ExtendedModule<PF2eToolbeltModule> | undefined;
declare function getActiveModule(name: "pf2e-dailies"): ExtendedModule<PF2eDailiesModule> | undefined;
declare function getActiveModule<T extends Module>(name: string): ExtendedModule<T> | undefined;
declare function getActiveModuleSetting<T = boolean>(name: string, setting: string): T | undefined;
type ExtendedModule<TModule extends Module> = TModule & {
    getSetting<T = boolean>(key: string): T;
};
export { MODULE, getActiveModule, getActiveModuleSetting };
