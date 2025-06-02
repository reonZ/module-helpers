declare function isHoldingModifierKey(key: ModifierKey | ModifierKey[]): boolean;
declare function registerKeybind(name: string, data: Partial<KeybindingActionConfig>): void;
declare function registerModuleKeybinds(keybinds: ModuleKeybinds): void;
declare function createToggleKeybind(options: WithRequired<KeybindingActionConfig, "onDown" | "onUp">): {
    configs: {
        onDown: (context: KeyboardEventContext) => void;
        onUp: (context: KeyboardEventContext) => void;
        namespace?: string | undefined;
        name: string;
        hint?: string | undefined;
        uneditable?: KeybindingActionBinding[] | undefined;
        editable?: KeybindingActionBinding[] | undefined;
        repeat?: boolean | undefined;
        restricted?: boolean | undefined;
        reservedModifiers?: ModifierKey[] | undefined;
        precedence?: number | undefined;
        order?: number | undefined;
    };
    activate(): void;
    disable(): void;
    toggle(enabled: boolean): void;
};
type ModuleKeybinds = Record<string, ReadonlyArray<KeybindingActionConfig>>;
export { createToggleKeybind, isHoldingModifierKey, registerKeybind, registerModuleKeybinds };
