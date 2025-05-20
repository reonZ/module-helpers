import { I18n, R } from ".";

function createHTMLElement<K extends keyof HTMLElementTagNameMap>(
    nodeName: K,
    { classes = [], dataset = {}, content, id }: CreateHTMLElementOptions = {}
): HTMLElementTagNameMap[K] {
    const element = document.createElement(nodeName);

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
    } else if (content) {
        element.append(...content);
    }

    return element;
}

function createHTMLElementContent(options?: CreateHTMLElementOptions): HTMLElement {
    return createHTMLElement("div", options).firstChild as HTMLElement;
}

function createHTMLButton({ icon, label, action, type }: ButtonData): HTMLButtonElement {
    const button = document.createElement("button");

    button.type = type ?? "button";
    button.innerHTML = `<i class="${icon}"></i> ${label}`;

    if (action) {
        button.dataset.action = action;
    }

    return button;
}

function createHTMLButtons(data: ButtonData[], wrapperClass = "buttons"): HTMLElement {
    const wrapper = document.createElement("div");

    wrapper.classList.add(wrapperClass);

    for (const entry of data) {
        const button = createHTMLButton(entry);
        wrapper.appendChild(button);
    }

    return wrapper;
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
    if (!(parent instanceof Element || parent instanceof Document)) return null;
    return parent.querySelector<HTMLElement>(selectors);
}

function htmlQueryAll<K extends keyof HTMLElementTagNameMap>(
    parent: MaybeHTML,
    selectors: K
): HTMLElementTagNameMap[K];
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

interface CreateHTMLElementOptions {
    classes?: string[];
    content?: string | HTMLCollection | (Element | string)[];
    dataset?: Record<string, string | number | boolean | null | undefined>;
    id?: string;
}

type ButtonData = {
    icon: string;
    label: string;
    action?: string;
    type?: "button" | "submit" | "reset";
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
    event: HTMLElementEventMap[TEvent]
) => void;

type IterableSelectOptions = SelectOption | string | FormSelectOption;

export {
    addListener,
    addListenerAll,
    arrayToSelectOptions,
    assignStyle,
    createHTMLButton,
    createHTMLButtons,
    createHTMLElement,
    createHTMLElementContent,
    datasetToData,
    dataToDatasetString,
    htmlClosest,
    htmlQuery,
    htmlQueryAll,
};

export type { DatasetData, DatasetValue, IterableSelectOptions };
