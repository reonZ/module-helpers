import { I18n, R } from ".";

type PersistentEvent = {
    activate(): void;
    disable(): void;
    toggle(enabled: boolean): void;
};

function createToggleableEvent<TEvent extends keyof DocumentEventMap>(
    event: TEvent,
    selector: null,
    listener: (ev: DocumentEventMap[TEvent]) => any,
    options?: boolean | AddEventListenerOptions
): PersistentEvent;
function createToggleableEvent<TEvent extends keyof HTMLElementEventMap>(
    event: TEvent,
    selector: string,
    listener: (ev: HTMLElementEventMap[TEvent]) => any,
    options?: boolean | AddEventListenerOptions
): PersistentEvent;
function createToggleableEvent(
    event: EventType,
    selector: string | null,
    listener: (ev: Event) => any,
    options?: boolean | AddEventListenerOptions
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
    { classes = [], dataset = {}, content, id, style }: CreateHTMLElementOptions = {}
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

function createHTMLElementContent(options?: CreateHTMLElementOptions): HTMLElement {
    return createHTMLElement("div", options).firstChild as HTMLElement;
}

function htmlQuery<K extends keyof HTMLElementTagNameMap>(
    parent: MaybeHTML,
    selectors: K
): HTMLElementTagNameMap[K] | null;
function htmlQuery<E extends HTMLElement = HTMLElement>(
    parent: MaybeHTML,
    selectors: string
): E | null;
function htmlQuery(parent: MaybeHTML, selectors: string): HTMLElement | null;
function htmlQuery(parent: MaybeHTML, selectors: string): HTMLElement | null {
    if (!(parent instanceof Element)) return null;
    return parent.querySelector<HTMLElement>(selectors);
}

function htmlQueryAll<K extends keyof HTMLElementTagNameMap>(
    parent: MaybeHTML,
    selectors: K
): HTMLElementTagNameMap[K][];
function htmlQueryAll<E extends HTMLElement = HTMLElement>(
    parent: MaybeHTML,
    selectors: string
): E[];
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
    selectors: K
): HTMLElementTagNameMap[K] | null;
function htmlClosest(child: MaybeHTML, selectors: string): HTMLElement | null;
function htmlClosest<E extends HTMLElement = HTMLElement>(
    child: MaybeHTML,
    selectors: string
): E | null;
function htmlClosest(child: MaybeHTML, selectors: string): HTMLElement | null {
    if (!(child instanceof Element)) return null;
    return child.closest<HTMLElement>(selectors);
}

function htmlQueryIn<K extends keyof HTMLElementTagNameMap>(
    child: MaybeHTML,
    parentSelector: string,
    siblingSelector: K
): HTMLElementTagNameMap[K] | null;
function htmlQueryIn(
    child: MaybeHTML,
    parentSelector: string,
    siblingSelector: string
): HTMLElement | null;
function htmlQueryIn<E extends HTMLElement = HTMLElement>(
    child: MaybeHTML,
    parentSelector: string,
    siblingSelector: string
): E | null;
function htmlQueryIn(
    child: MaybeHTML,
    parentSelector: string,
    siblingSelector: string
): HTMLElement | null {
    const parent = htmlClosest(child, parentSelector);
    return htmlQuery(parent, siblingSelector);
}

function arrayToSelectOptions(
    entries: Iterable<IterableSelectOptions>,
    i18n?: I18n
): WithRequired<SelectOption, "label">[] {
    const newEntries: WithRequired<SelectOption, "label">[] = [];

    for (const entry of entries) {
        const newEntry = typeof entry === "string" ? { value: entry, label: entry } : entry;
        newEntries.push({
            ...newEntry,
            label:
                i18n?.localizeIfExist(newEntry.label ?? newEntry.value) ??
                game.i18n.localize(newEntry.label ?? newEntry.value),
        });
    }

    return newEntries;
}

function assignStyle(el: HTMLElement, style: Partial<CSSStyleDeclaration>) {
    Object.assign(el.style, style);
}

function dataToDatasetString(data: DatasetData): string {
    return R.pipe(
        !R.isArray(data) ? R.entries(data) : data,
        R.map(([key, value]): string | undefined => {
            if (R.isNullish(value)) return;

            const sluggifiedKey = key.replace(/\B([A-Z])/g, "-$1").toLowerCase();
            const stringified = R.isObjectType(value) ? JSON.stringify(value) : value;

            return `data-${sluggifiedKey}='${stringified}'`;
        }),
        R.filter(R.isTruthy),
        R.join(" ")
    );
}

function datasetToData<T extends Record<string, any>>(dataset: DOMStringMap): T {
    const data = {} as T;

    for (const [sluggifiedKey, stringValue] of R.entries(dataset)) {
        const key = game.pf2e.system.sluggify(sluggifiedKey, { camel: "dromedary" }) as keyof T;

        try {
            data[key] = stringValue ? JSON.parse(stringValue) : undefined;
        } catch (error) {
            data[key] = stringValue as T[keyof T];
        }
    }

    return data;
}

function firstElementWithText(el: Maybe<Element>): HTMLElement | null {
    if (!(el instanceof HTMLElement)) return null;

    const childNodes = el.childNodes;
    if (!childNodes.length) return null;

    for (const child of childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
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

function getInputValue(el: HTMLInputElement) {
    return el.nodeName === "RANGE-PICKER" || ["number", "range"].includes(el.type)
        ? el.valueAsNumber
        : el.type === "checkbox"
        ? el.checked
        : el.value.trim();
}

interface CreateHTMLElementOptions {
    classes?: string[];
    content?: string | HTMLCollection | (Element | string)[] | Element;
    dataset?: Record<string, string | number | boolean | null | undefined>;
    id?: string;
    style?: Partial<CSSStyleDeclaration>;
}

type DatasetValue = Maybe<string | number | boolean | object>;
type DatasetData = Record<string, DatasetValue> | [string, DatasetValue][];

type ListenerCallbackArgs<E extends HTMLElement, TEvent extends EventType> =
    | [TEvent, ListenerCallback<E, TEvent>, boolean]
    | [TEvent, ListenerCallback<E, TEvent>]
    | [ListenerCallback<E, TEvent>, boolean]
    | [ListenerCallback<E, TEvent>];

type ListenerCallback<TElement extends HTMLElement, TEvent extends EventType> = (
    element: TElement,
    event: HTMLElementEventMap[TEvent]
) => void;

type IterableSelectOptions = SelectOption | string | FormSelectOption;

export {
    addListener,
    addListenerAll,
    arrayToSelectOptions,
    assignStyle,
    createHTMLElement,
    createHTMLElementContent,
    createToggleableEvent,
    datasetToData,
    dataToDatasetString,
    firstElementWithText,
    getInputValue,
    htmlClosest,
    htmlQuery,
    htmlQueryAll,
    htmlQueryIn,
};

export type { DatasetData, DatasetValue, IterableSelectOptions };
