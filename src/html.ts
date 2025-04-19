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

function htmlQuery<K extends keyof HTMLElementTagNameMap>(
    parent: MaybeHTML,
    selectors: K
): HTMLElementTagNameMap[K] | null;
function htmlQuery(parent: MaybeHTML, selectors: string): HTMLElement | null;
function htmlQuery<E extends HTMLElement = HTMLElement>(
    parent: MaybeHTML,
    selectors: string
): E | null;
function htmlQuery(parent: MaybeHTML, selectors: string): HTMLElement | null {
    if (!(parent instanceof Element || parent instanceof Document)) return null;
    return parent.querySelector<HTMLElement>(selectors);
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

    element.addEventListener(event, (e) => listener(e, element), useCapture);
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
        element.addEventListener(event, (e) => listener(e, element), useCapture);
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
    entries: Iterable<SelectOption | string | FormSelectOption>,
    i18n?: I18n
): WithRequired<SelectOption, "label">[] {
    const newEntries: WithRequired<SelectOption, "label">[] = [];
    const localizer = i18n?.localize.bind(i18n) ?? game.i18n.localize.bind(game.i18n);

    for (const entry of entries) {
        const newEntry =
            typeof entry === "string" ? { value: entry, label: entry } : (entry as SelectOption);

        newEntries.push({
            ...newEntry,
            value: newEntry.value,
            label: localizer(newEntry.label ?? newEntry.value),
        });
    }

    return newEntries;
}

interface CreateHTMLElementOptions {
    classes?: string[];
    content?: string | HTMLCollection | (Element | string)[];
    dataset?: Record<string, string | number | boolean | null | undefined>;
    id?: string;
}

type ListenerCallbackArgs<E extends HTMLElement, TEvent extends EventType> =
    | [TEvent, ListenerCallback<E, TEvent>, boolean]
    | [TEvent, ListenerCallback<E, TEvent>]
    | [ListenerCallback<E, TEvent>, boolean]
    | [ListenerCallback<E, TEvent>];

type ListenerCallback<TElement extends HTMLElement, TEvent extends EventType> = (
    event: HTMLElementEventMap[TEvent],
    element: TElement
) => void;

export {
    addListener,
    addListenerAll,
    arrayToSelectOptions,
    createHTMLElement,
    htmlClosest,
    htmlQuery,
};
