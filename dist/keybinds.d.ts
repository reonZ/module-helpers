declare function registerKeybind(name: string, data: Partial<KeybindingActionConfig>): void;
declare function registerModuleKeybinds(keybinds: ModuleKeybinds): void;
type ModuleKeybinds = Record<string, ReadonlyArray<KeybindingActionConfig>>;
export { registerKeybind, registerModuleKeybinds };
