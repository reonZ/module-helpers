import {
    ApplicationConfiguration,
    ApplicationWindowConfiguration,
} from "foundry-pf2e/foundry/client-esm/applications/_types.js";

declare global {
    type PartialApplicationConfiguration<
        TConfig extends ApplicationConfiguration = ApplicationConfiguration
    > = Partial<
        Omit<TConfig, "window"> & {
            window: Partial<ApplicationWindowConfiguration>;
        }
    >;

    type FormDataExtendedOptions = {
        editors?: Record<string, TinyMCEEditorData>;
        dtypes?: string[];
        disabled?: boolean;
        readonly?: boolean;
    };
}
