declare function registerKeybind(name: string, data: Partial<KeybindingActionConfig>): void;
declare function registerModuleKeybinds(keybinds: ModuleKeybinds): void;
declare function createToggleKeybind(options: WithRequired<KeybindingActionConfig, "onDown" | "onUp">): {
    configs: {
        onDown: (context: KeyboardEventContext) => void;
        onUp: (context: KeyboardEventContext) => void;
        order?: number | undefined;
        repeat?: boolean | undefined;
        name: string;
        editable?: KeybindingActionBinding[] | undefined;
        hint?: string | undefined;
        namespace?: string | undefined;
        uneditable?: KeybindingActionBinding[] | undefined;
        restricted?: boolean | undefined;
        reservedModifiers?: ModifierKey[] | undefined;
        precedence?: number | undefined;
    };
    activate(): void;
    disable(): void;
    toggle(enabled: boolean): void;
};
type ModuleKeybinds = Record<string, ReadonlyArray<KeybindingActionConfig>>;
export { createToggleKeybind, registerKeybind, registerModuleKeybinds };
