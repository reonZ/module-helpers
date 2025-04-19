import { I18n } from ".";
declare function createHTMLElement<K extends keyof HTMLElementTagNameMap>(nodeName: K, { classes, dataset, content, id }?: CreateHTMLElementOptions): HTMLElementTagNameMap[K];
declare function htmlQuery<K extends keyof HTMLElementTagNameMap>(parent: MaybeHTML, selectors: K): HTMLElementTagNameMap[K] | null;
declare function htmlQuery(parent: MaybeHTML, selectors: string): HTMLElement | null;
declare function htmlQuery<E extends HTMLElement = HTMLElement>(parent: MaybeHTML, selectors: string): E | null;
declare function addListener<K extends keyof HTMLElementTagNameMap, TEvent extends EventType = "click">(parent: MaybeHTML, selectors: K, ...args: ListenerCallbackArgs<HTMLElementTagNameMap[K], TEvent>): void;
declare function addListener<TEvent extends EventType = "click">(parent: MaybeHTML, selectors: string, ...args: ListenerCallbackArgs<HTMLElement, TEvent>): void;
declare function addListener<E extends HTMLElement, TEvent extends EventType = "click">(parent: MaybeHTML, selectors: string, ...args: ListenerCallbackArgs<E, TEvent>): void;
declare function addListenerAll<K extends keyof HTMLElementTagNameMap, TEvent extends EventType = "click">(parent: MaybeHTML, selectors: K, ...args: ListenerCallbackArgs<HTMLElementTagNameMap[K], TEvent>): void;
declare function addListenerAll<TEvent extends EventType = "click">(parent: MaybeHTML, selectors: string, ...args: ListenerCallbackArgs<HTMLElement, TEvent>): void;
declare function addListenerAll<E extends HTMLElement, TEvent extends EventType = "click">(parent: MaybeHTML, selectors: string, ...args: ListenerCallbackArgs<E, TEvent>): void;
declare function htmlClosest<K extends keyof HTMLElementTagNameMap>(child: MaybeHTML, selectors: K): HTMLElementTagNameMap[K] | null;
declare function htmlClosest(child: MaybeHTML, selectors: string): HTMLElement | null;
declare function htmlClosest<E extends HTMLElement = HTMLElement>(child: MaybeHTML, selectors: string): E | null;
declare function arrayToSelectOptions(entries: Iterable<SelectOption | string | FormSelectOption>, i18n?: I18n): WithRequired<SelectOption, "label">[];
interface CreateHTMLElementOptions {
    classes?: string[];
    content?: string | HTMLCollection | (Element | string)[];
    dataset?: Record<string, string | number | boolean | null | undefined>;
    id?: string;
}
type ListenerCallbackArgs<E extends HTMLElement, TEvent extends EventType> = [TEvent, ListenerCallback<E, TEvent>, boolean] | [TEvent, ListenerCallback<E, TEvent>] | [ListenerCallback<E, TEvent>, boolean] | [ListenerCallback<E, TEvent>];
type ListenerCallback<TElement extends HTMLElement, TEvent extends EventType> = (event: HTMLElementEventMap[TEvent], element: TElement) => void;
export { addListener, addListenerAll, arrayToSelectOptions, createHTMLElement, htmlClosest, htmlQuery, };
