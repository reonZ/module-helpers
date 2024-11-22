export {};

declare global {
    type FormDataExtendedOptions = {
        editors?: Record<string, TinyMCEEditorData>;
        dtypes?: string[];
        disabled?: boolean;
        readonly?: boolean;
    };
}
