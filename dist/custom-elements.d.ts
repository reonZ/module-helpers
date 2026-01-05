import appElements = foundry.applications.elements;
declare class ExtendedTextInputElement extends appElements.AbstractFormInputElement<string, string> {
    #private;
    static tagName: "extended-text-input";
    constructor({ value }?: {
        value?: string;
    });
    protected _buildElements(): HTMLElement[];
    protected _setValue(value: unknown): void;
    protected _toggleDisabled(disabled: boolean): void;
    _activateListeners(): void;
    protected _refresh(): void;
}
declare const TAGS_MODES: readonly ["and", "or"];
declare class ExtendedMultiSelectElement extends appElements.HTMLMultiSelectElement {
    #private;
    static MODES: Record<MultiSelectTagsMode, string>;
    static tagName: "extended-multi-select";
    constructor();
    get mode(): MultiSelectTagsMode;
    set mode(value: MultiSelectTagsMode);
    toggleMode(): void;
    protected _refresh(): void;
    protected _buildElements(): HTMLElement[];
    protected _toggleDisabled(disabled: boolean): void;
    _activateListeners(): void;
}
declare const CUSTOM_ELEMENTS: {
    "extended-multi-select": typeof ExtendedMultiSelectElement;
    "extended-text-input": typeof ExtendedTextInputElement;
};
declare function registerCustomElements(...tags: CustomElementTag[]): void;
declare function registerCustomElement(tag: string, element: CustomElementConstructor): void;
type MultiSelectTagsMode = (typeof TAGS_MODES)[number];
type CustomElementTag = keyof typeof CUSTOM_ELEMENTS;
type ExtendedMultiSelectModeEvent = CustomEvent<0 | 1>;
export { ExtendedMultiSelectElement, ExtendedTextInputElement, registerCustomElements, registerCustomElement };
export type { ExtendedMultiSelectModeEvent, MultiSelectTagsMode };
