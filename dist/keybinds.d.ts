declare function registerKeybind(name: string, data: Partial<KeybindingActionConfig>): void;
declare function registerModuleKeybinds(keybinds: ModuleKeybinds): void;
declare function createToggleKeybind(options: WithRequired<KeybindingActionConfig, "onDown" | "onUp">): {
    configs: {
        onDown: (context: KeyboardEventContext) => void;
        onUp: (context: KeyboardEventContext) => void;
        name: string;
        namespace?: string | undefined;
        hint?: string | undefined;
        restricted?: boolean | undefined;
        editable?: KeybindingActionBinding[] | undefined;
        repeat?: boolean | undefined;
        order?: number | undefined;
        uneditable?: KeybindingActionBinding[] | undefined;
        reservedModifiers?: ModifierKey[] | undefined;
        precedence?: number | undefined;
    };
    activate(): void;
    disable(): void;
    toggle(enabled: boolean): void;
};
type ModuleKeybinds = Record<string, ReadonlyArray<KeybindingActionConfig>>;
export { createToggleKeybind, registerKeybind, registerModuleKeybinds };
