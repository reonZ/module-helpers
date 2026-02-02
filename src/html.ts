import { R, sluggify } from ".";

type PersistentEvent = {
    activate(): void;
    disable(): void;
    toggle(enabled: boolean): void;
};

function createToggleableEvent<TEvent extends keyof DocumentEventMap>(
    event: TEvent,
    selector: null,
    listener: (ev: DocumentEventMap[TEvent]) => any,
    options?: boolean | AddEventListenerOptions,
): PersistentEvent;
function createToggleableEvent<TEvent extends keyof HTMLElementEventMap>(
    event: TEvent,
    selector: string,
    listener: (ev: HTMLElementEventMap[TEvent]) => any,
    options?: boolean | AddEventListenerOptions,
): PersistentEvent;
function createToggleableEvent(
    event: EventType,
    selector: string | null,
    listener: (ev: Event) => any,
    options?: boolean | AddEventListenerOptions,
) {
    let enabled = false;

    const getElement = (): Document | HTMLElement | null => {
        return selector ? document.querySelector<HTMLElement>(selector) : document;
    };

    return {
        activate() {
            if (enabled) return;

            requestAnimationFrame(() => {
                getElement()?.addEventListener(event, listener, options);
            });

            enabled = true;
        },
        disable() {
            if (!enabled) return;

            getElement()?.removeEventListener(event, listener, options);

            enabled = false;
        },
        toggle(enabled: boolean) {
            if (enabled) this.activate();
            else this.disable();
        },
    };
}

function createHTMLElement<K extends keyof HTMLElementTagNameMap>(
    nodeName: K,
    { classes = [], dataset = {}, content, id, style }: CreateHTMLElementOptions = {},
): HTMLElementTagNameMap[K] {
    const element = document.createElement(nodeName);

    if (element instanceof HTMLButtonElement) {
        element.type = "button";
    }

    if (style) {
        assignStyle(element, style);
    }

    if (id) {
        element.id = id;
    }

    if (classes.length > 0) {
        element.classList.add(...classes);
    }

    for (const [key, value] of Object.entries(dataset)) {
        if (R.isNullish(value) || value === false) continue;
        element.dataset[key] = value === true ? "" : String(value);
    }

    if (R.isString(content)) {
        element.innerHTML = content;
    } else if (content instanceof Element) {
        element.append(content);
    } else if (content) {
        element.append(...content);
    }

    return element;
}

function createInputElement(
    type: "text" | "number" | "radio" | "checkbox",
    name: string,
    value: string | number | boolean,
    options?: CreateHTMLInputElementOptions,
): HTMLInputElement {
    const input = createHTMLElement("input", options);

    input.type = type;
    input.name = name;

    if (type === "text") {
        input.value = String(value);
    } else if (type === "number") {
        input.valueAsNumber = Number(value) || 0;
    } else if (type === "checkbox") {
        input.checked = Boolean(value);
    } else {
        input.value = String(value);
        input.checked = !!options?.checked;
    }

    return input;
}

function createButtonElement(options: CreateHTMLButtonElementOptions): HTMLButtonElement {
    let content = "";

    if (options.icon) {
        content += `<i class="${options.icon}"> `;
    }

    if (options.label) {
        content += options.label;
    }

    const button = createHTMLElement("button", { ...options, content });

    button.type = "button";

    return button;
}

function createHTMLElementContent(options?: CreateHTMLElementOptions): HTMLElement {
    return createHTMLElement("div", options).firstChild as HTMLElement;
}

function htmlQuery<K extends keyof HTMLElementTagNameMap>(
    parent: MaybeHTML,
    selectors: K,
): HTMLElementTagNameMap[K] | null;
function htmlQuery<E extends HTMLElement = HTMLElement>(parent: MaybeHTML, selectors: string): E | null;
function htmlQuery(parent: MaybeHTML, selectors: string): HTMLElement | null;
function htmlQuery(parent: MaybeHTML, selectors: string): HTMLElement | null {
    if (!(parent instanceof Element)) return null;
    return parent.querySelector<HTMLElement>(selectors);
}

function htmlQueryAll<K extends keyof HTMLElementTagNameMap>(
    parent: MaybeHTML,
    selectors: K,
): HTMLElementTagNameMap[K][];
function htmlQueryAll<E extends HTMLElement = HTMLElement>(parent: MaybeHTML, selectors: string): E[];
function htmlQueryAll(parent: MaybeHTML, selectors: string): HTMLElement[];
function htmlQueryAll(parent: MaybeHTML, selectors: string): HTMLElement[] {
    if (!(parent instanceof Element || parent instanceof Document)) return [];
    return Array.from(parent.querySelectorAll<HTMLElement>(selectors));
}

function addListener<K extends keyof HTMLElementTagNameMap, TEvent extends EventType = "click">(
    parent: MaybeHTML,
    selectors: K,
    ...args: ListenerCallbackArgs<HTMLElementTagNameMap[K], TEvent>
): void;
function addListener<TEvent extends EventType = "click">(
    parent: MaybeHTML,
    selectors: string,
    ...args: ListenerCallbackArgs<HTMLElement, TEvent>
): void;
function addListener<E extends HTMLElement, TEvent extends EventType = "click">(
    parent: MaybeHTML,
    selectors: string,
    ...args: ListenerCallbackArgs<E, TEvent>
): void;
function addListener(
    parent: MaybeHTML,
    selectors: string,
    ...args: ListenerCallbackArgs<HTMLElement, EventType>
): void {
    if (!(parent instanceof Element || parent instanceof Document)) return;

    const element = parent.querySelector(selectors);
    if (!(element instanceof HTMLElement)) return;

    const event = typeof args[0] === "string" ? args[0] : "click";
    const listener = typeof args[0] === "function" ? args[0] : args[1];
    const useCapture = typeof args[1] === "boolean" ? args[1] : args[2];

    element.addEventListener(event, (e) => listener(element, e), useCapture);
}

function addListenerAll<K extends keyof HTMLElementTagNameMap, TEvent extends EventType = "click">(
    parent: MaybeHTML,
    selectors: K,
    ...args: ListenerCallbackArgs<HTMLElementTagNameMap[K], TEvent>
): void;
function addListenerAll<TEvent extends EventType = "click">(
    parent: MaybeHTML,
    selectors: string,
    ...args: ListenerCallbackArgs<HTMLElement, TEvent>
): void;
function addListenerAll<E extends HTMLElement, TEvent extends EventType = "click">(
    parent: MaybeHTML,
    selectors: string,
    ...args: ListenerCallbackArgs<E, TEvent>
): void;
function addListenerAll(
    parent: MaybeHTML,
    selectors: string,
    ...args: ListenerCallbackArgs<HTMLElement, EventType>
): void {
    if (!(parent instanceof Element || parent instanceof Document)) return;

    const elements = parent.querySelectorAll(selectors);
    const event = typeof args[0] === "string" ? args[0] : "click";
    const listener = typeof args[0] === "function" ? args[0] : args[1];
    const useCapture = typeof args[1] === "boolean" ? args[1] : args[2];

    for (const element of elements) {
        if (!(element instanceof HTMLElement)) continue;
        element.addEventListener(event, (e) => listener(element, e), useCapture);
    }
}

function htmlClosest<K extends keyof HTMLElementTagNameMap>(
    child: MaybeHTML,
    selectors: K,
): HTMLElementTagNameMap[K] | null;
function htmlClosest(child: MaybeHTML, selectors: string): HTMLElement | null;
function htmlClosest<E extends HTMLElement = HTMLElement>(child: MaybeHTML, selectors: string): E | null;
function htmlClosest(child: MaybeHTML, selectors: string): HTMLElement | null {
    if (!(child instanceof Element)) return null;
    return child.closest<HTMLElement>(selectors);
}

function htmlQueryIn<K extends keyof HTMLElementTagNameMap>(
    child: MaybeHTML,
    parentSelector: string,
    siblingSelector: K,
): HTMLElementTagNameMap[K] | null;
function htmlQueryIn(child: MaybeHTML, parentSelector: string, siblingSelector: string): HTMLElement | null;
function htmlQueryIn<E extends HTMLElement = HTMLElement>(
    child: MaybeHTML,
    parentSelector: string,
    siblingSelector: string,
): E | null;
function htmlQueryIn(child: MaybeHTML, parentSelector: string, siblingSelector: string): HTMLElement | null {
    const parent = htmlClosest(child, parentSelector);
    return htmlQuery(parent, siblingSelector);
}

function assignStyle(el: HTMLElement, style: Partial<CSSStyleDeclaration>) {
    Object.assign(el.style, style);
}

function setStyleProperties(el: HTMLElement, properties: Record<string, string | number | boolean>) {
    for (const [property, value] of R.entries(properties)) {
        el.style.setProperty(property, String(value));
    }
}

function dataToDatasetString(data: DatasetData): string {
    return R.pipe(
        !R.isArray(data) ? R.entries(data) : data,
        R.map(([key, value]): string | undefined => {
            if (R.isNullish(value)) return;

            const sluggifiedKey = key.replace(/\B([A-Z])/g, "-$1").toLowerCase();
            const stringified = R.isObjectType(value) ? foundry.utils.escapeHTML(JSON.stringify(value)) : value;

            return `data-${sluggifiedKey}='${stringified}'`;
        }),
        R.filter(R.isTruthy),
        R.join(" "),
    );
}

function datasetToData<T extends Record<string, any>>(elOrDataset: DOMStringMap | HTMLElement): T {
    const data = {} as T;
    const dataset = elOrDataset instanceof DOMStringMap ? elOrDataset : elOrDataset.dataset;

    for (const [sluggifiedKey, stringValue] of R.entries(dataset)) {
        const key = sluggify(sluggifiedKey, { camel: "dromedary" }) as keyof T;

        try {
            data[key] = stringValue ? JSON.parse(stringValue) : undefined;
        } catch (error) {
            data[key] = stringValue as T[keyof T];
        }
    }

    return data;
}

function firstElementWithText(el: Maybe<Element>, skipEmpty = true): HTMLElement | null {
    if (!(el instanceof HTMLElement)) return null;

    const childNodes = el.childNodes;
    if (!childNodes.length) return null;

    for (const child of childNodes) {
        if (child.nodeType === Node.TEXT_NODE && (!skipEmpty || child.textContent?.trim())) {
            return el;
        }
    }

    for (const child of el.children) {
        const withText = firstElementWithText(child);
        if (withText) {
            return withText;
        }
    }

    return null;
}

function getInputValue(el: HTMLInputElement | HTMLSelectElement) {
    if (el instanceof HTMLSelectElement) {
        return el.value;
    }

    return el.nodeName === "RANGE-PICKER" || ["number", "range"].includes(el.type)
        ? el.valueAsNumber
        : el.type === "checkbox"
          ? el.checked
          : el.value;
}

/**
 * repurposed version of
 * https://github.com/foundryvtt/pf2e/blob/c0cfa1f4c266d7d843966b50a9fd1a34d42b2051/src/module/actor/sheet/item-summary-renderer.ts#L25
 */
async function toggleSummary(summaryElem: HTMLElement) {
    const duration = 0.4;

    if (summaryElem.hidden) {
        await gsap.fromTo(
            summaryElem,
            { height: 0, opacity: 0, hidden: false },
            { height: "auto", opacity: 1, duration },
        );
    } else {
        await gsap.to(summaryElem, {
            height: 0,
            duration,
            opacity: 0,
            paddingTop: 0,
            paddingBottom: 0,
            margin: 0,
            clearProps: "all",
            onComplete: () => {
                summaryElem.hidden = true;
            },
        });
    }
}

function addEnterKeyListeners(html: HTMLElement, inputType: "number" | "text" | "all" = "all") {
    const types: ("text" | "number")[] = inputType === "all" ? ["text", "number"] : [inputType];
    const selector = types.map((type) => `input[type="${type}"]`).join(", ");

    addListenerAll(html, selector, "keypress", (el, event) => {
        if (event.key === "Enter") {
            event.stopPropagation();
            event.preventDefault();
            el.blur();
        }
    });
}

type CreateHTMLElementOptions = {
    classes?: string[];
    content?: string | HTMLCollection | (Element | string)[] | Element;
    dataset?: Record<string, string | number | boolean | null | undefined>;
    id?: string;
    style?: Partial<CSSStyleDeclaration>;
};

type CreateHTMLButtonElementOptions = Omit<CreateHTMLElementOptions, "id" | "content"> &
    RequireAtLeastOne<{ icon?: string; label?: string }>;

type CreateHTMLInputElementOptions = Omit<CreateHTMLElementOptions, "content" | "id"> & {
    checked?: boolean;
};

type DatasetValue = Maybe<string | number | boolean | object>;
type DatasetData = Record<string, DatasetValue> | [string, DatasetValue][];

type ListenerCallbackArgs<E extends HTMLElement, TEvent extends EventType> =
    | [TEvent, ListenerCallback<E, TEvent>, boolean]
    | [TEvent, ListenerCallback<E, TEvent>]
    | [ListenerCallback<E, TEvent>, boolean]
    | [ListenerCallback<E, TEvent>];

type ListenerCallback<TElement extends HTMLElement, TEvent extends EventType> = (
    element: TElement,
    event: HTMLElementEventMap[TEvent],
) => void;

type IterableSelectOptions = SelectOption | string | FormSelectOption;

export {
    addEnterKeyListeners,
    addListener,
    addListenerAll,
    assignStyle,
    createButtonElement,
    createHTMLElement,
    createHTMLElementContent,
    createInputElement,
    createToggleableEvent,
    datasetToData,
    dataToDatasetString,
    firstElementWithText,
    getInputValue,
    htmlClosest,
    htmlQuery,
    htmlQueryAll,
    htmlQueryIn,
    setStyleProperties,
    toggleSummary,
};

export type { DatasetData, DatasetValue, IterableSelectOptions };
