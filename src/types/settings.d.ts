export {};

declare global {
    interface SettingOptions<
        TChoices extends Record<string, unknown> | string[] | undefined =
            | Record<string, unknown>
            | string[]
            | undefined
    > extends Omit<SettingRegistration, "choices" | "onChange" | "range" | "name" | "hint"> {
        key: string;
        choices?: Record<string, unknown> | ReadonlyArray<string> | Array<string>;
        onChange?: (
            choice: TChoices extends ReadonlyArray<string> | Array<string>
                ? TChoices[number]
                : TChoices extends object
                ? keyof TChoices
                : any
        ) => any | Promise<any>;
        range?: {
            min: number;
            max: number;
            step: number;
        };
        gmOnly?: boolean;
        name?: string;
        hint?: string;
    }

    interface MenuSettingOptions extends Partial<Omit<SettingSubmenuConfig, "type">> {
        key: string;
        type: Omit<SettingsMenuConstructor, "registerSettings">;
    }
}
