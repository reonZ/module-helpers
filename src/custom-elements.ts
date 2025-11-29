import { createHTMLElement } from "./html";
import appElements = foundry.applications.elements;
import { R } from ".";

class ExtendedTextInputElement extends appElements.AbstractFormInputElement<string, string> {
    #clearElement?: HTMLAnchorElement;
    #inputElement!: HTMLInputElement;
    #input: string;

    static tagName: "extended-text-input" = "extended-text-input";

    constructor({ value }: { value?: string } = {}) {
        super();

        this._setValue(value || this.getAttribute("value"));
        this.#input = this.value;
    }

    protected _buildElements(): HTMLElement[] {
        this.#inputElement = this._primaryInput = document.createElement("input");
        this.#inputElement.type = "text";
        this.#inputElement.placeholder = this.getAttribute("placeholder") || "";

        const elements: HTMLElement[] = [this.#inputElement];

        if (this.getAttribute("clear") === "true") {
            this.#clearElement = createHTMLElement("a", {
                classes: ["clear-tags"],
                content: `<i class="fa-solid fa-circle-x"></i>`,
                dataset: {
                    tooltip: this.getAttribute("clear-tooltip") || undefined,
                },
            });

            elements.push(this.#clearElement);
        }

        return elements;
    }

    protected _setValue(value: unknown): void {
        this._value = R.isString(value) ? value : "";
    }

    protected _toggleDisabled(disabled: boolean): void {
        this.#clearElement?.classList.toggle("disabled", disabled);
        this.#inputElement.disabled = disabled;
    }

    _activateListeners(): void {
        this.#clearElement?.addEventListener("click", this.#onClickClear.bind(this));

        this.#inputElement.addEventListener("blur", this.#onBlur.bind(this));
        this.#inputElement.addEventListener("change", this.#onChange.bind(this));
        this.#inputElement.addEventListener("focus", this.#onFocus.bind(this));
        this.#inputElement.addEventListener("input", this.#onInput.bind(this));
        this.#inputElement.addEventListener("keydown", this.#onKeyDown.bind(this));
    }

    protected _refresh(): void {
        this.#inputElement.value = this._value;
    }

    #onBlur(event: Event) {
        event.stopPropagation();
        event.stopImmediatePropagation();

        this.#input = this.value;
        this.dispatchEvent(new Event("blur", { bubbles: true, cancelable: true }));
        this._refresh();
    }

    #onChange(event: Event) {
        event.stopPropagation();
        event.stopImmediatePropagation();

        this._setValue(this.#inputElement.value);
        this.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
        this._refresh();
    }

    #onFocus() {
        this.#input = this.value;
    }

    #onInput(event: Event) {
        event.stopPropagation();
        event.stopImmediatePropagation();

        this._setValue(this.#inputElement.value);
        this.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
        this._refresh();
    }

    #onKeyDown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            event.preventDefault();

            this.#inputElement.blur();
        } else if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            this._setValue(this.#input);
            this.#inputElement.value = this.#input;
            this.#inputElement.blur();
        }
    }

    #onClickClear() {
        this.#input = "";
        this.value = "";
    }
}

const TAGS_MODES = ["and", "or"] as const;

class ExtendedMultiSelectElement extends appElements.HTMLMultiSelectElement {
    #clearElement!: HTMLAnchorElement;
    #modeElement!: HTMLAnchorElement;
    #mode: MultiSelectTagsMode;
    #modes: {
        and: string;
        or: string;
    };

    static MODES: Record<MultiSelectTagsMode, string> = {
        and: `<span>&</span>`,
        or: `<i class="fa-solid fa-greater-than-equal"></i>`,
    };

    static tagName: "extended-multi-select" = "extended-multi-select";

    constructor() {
        super();

        const mode = this.getAttribute("mode");
        this.#mode = R.isIncludedIn(mode, TAGS_MODES) ? mode : "and";

        this.#modes = {
            and: this.getAttribute("mode-and") || ExtendedMultiSelectElement.MODES.and,
            or: this.getAttribute("mode-or") || ExtendedMultiSelectElement.MODES.or,
        };
    }

    get mode(): MultiSelectTagsMode {
        return this.#mode;
    }

    set mode(value) {
        if (value === this.#mode || (value !== "and" && value !== "or")) return;

        this.#mode = value;
        this.#modeElement.innerHTML = this.#modes[this.#mode];

        this.dispatchEvent(
            new CustomEvent("mode", {
                detail: this.#mode,
                bubbles: true,
                cancelable: true,
            })
        );
    }

    toggleMode() {
        this.mode = this.mode === "and" ? "or" : "and";
    }

    protected _refresh(): void {
        super._refresh();

        this.#modeElement.innerHTML = this.#modes[this.#mode];
    }

    protected _buildElements(): HTMLElement[] {
        const elements = super._buildElements();

        this.#clearElement = createHTMLElement("a", {
            classes: ["clear-tags"],
            content: `<i class="fa-solid fa-circle-x"></i>`,
            dataset: {
                tooltip: this.getAttribute("clear-tooltip") || undefined,
            },
        });

        this.#modeElement = createHTMLElement("a", {
            classes: ["tags-mode"],
            content: this.#modes[this.#mode],
            dataset: {
                tooltip: this.getAttribute("mode-tooltip") || undefined,
            },
        });

        return [...elements, this.#modeElement, this.#clearElement];
    }

    protected _toggleDisabled(disabled: boolean): void {
        super._toggleDisabled(disabled);

        this.#clearElement.classList.toggle("disabled", disabled);
        this.#modeElement.classList.toggle("disabled", disabled);
    }

    _activateListeners(): void {
        super._activateListeners();

        this.#clearElement.addEventListener("click", this.#onClickClear.bind(this));
        this.#modeElement.addEventListener("click", this.toggleMode.bind(this));
    }

    #onClickClear() {
        if (this._value.size === 0) return;

        this._value.clear();
        this.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
        this._refresh();
    }
}

const CUSTOM_ELEMENTS = {
    [ExtendedMultiSelectElement.tagName]: ExtendedMultiSelectElement,
    [ExtendedTextInputElement.tagName]: ExtendedTextInputElement,
};

function registerCustomElements(...tags: CustomElementTag[]) {
    try {
        for (const tag of tags) {
            if (!(tag in CUSTOM_ELEMENTS)) continue;
            window.customElements.define(tag, CUSTOM_ELEMENTS[tag]);
        }
    } catch (error) {
        console.error(error);
    }
}

type MultiSelectTagsMode = (typeof TAGS_MODES)[number];

type CustomElementTag = keyof typeof CUSTOM_ELEMENTS;

type ExtendedMultiSelectModeEvent = CustomEvent<0 | 1>;

export { ExtendedMultiSelectElement, ExtendedTextInputElement, registerCustomElements };
export type { ExtendedMultiSelectModeEvent, MultiSelectTagsMode };
