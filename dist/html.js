import { R } from ".";
function createHTMLElement(nodeName, { classes = [], dataset = {}, content, id, style } = {}) {
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
        if (R.isNullish(value) || value === false)
            continue;
        element.dataset[key] = value === true ? "" : String(value);
    }
    if (R.isString(content)) {
        element.innerHTML = content;
    }
    else if (content instanceof Element) {
        element.append(content);
    }
    else if (content) {
        element.append(...content);
    }
    return element;
}
function createHTMLElementContent(options) {
    return createHTMLElement("div", options).firstChild;
}
function htmlQuery(parent, selectors) {
    if (!(parent instanceof Element))
        return null;
    return parent.querySelector(selectors);
}
function htmlQueryAll(parent, selectors) {
    if (!(parent instanceof Element || parent instanceof Document))
        return [];
    return Array.from(parent.querySelectorAll(selectors));
}
function addListener(parent, selectors, ...args) {
    if (!(parent instanceof Element || parent instanceof Document))
        return;
    const element = parent.querySelector(selectors);
    if (!(element instanceof HTMLElement))
        return;
    const event = typeof args[0] === "string" ? args[0] : "click";
    const listener = typeof args[0] === "function" ? args[0] : args[1];
    const useCapture = typeof args[1] === "boolean" ? args[1] : args[2];
    element.addEventListener(event, (e) => listener(element, e), useCapture);
}
function addListenerAll(parent, selectors, ...args) {
    if (!(parent instanceof Element || parent instanceof Document))
        return;
    const elements = parent.querySelectorAll(selectors);
    const event = typeof args[0] === "string" ? args[0] : "click";
    const listener = typeof args[0] === "function" ? args[0] : args[1];
    const useCapture = typeof args[1] === "boolean" ? args[1] : args[2];
    for (const element of elements) {
        if (!(element instanceof HTMLElement))
            continue;
        element.addEventListener(event, (e) => listener(element, e), useCapture);
    }
}
function htmlClosest(child, selectors) {
    if (!(child instanceof Element))
        return null;
    return child.closest(selectors);
}
function arrayToSelectOptions(entries, i18n) {
    const newEntries = [];
    for (const entry of entries) {
        const newEntry = typeof entry === "string" ? { value: entry, label: entry } : entry;
        newEntries.push({
            ...newEntry,
            label: i18n?.localizeIfExist(newEntry.label ?? newEntry.value) ??
                game.i18n.localize(newEntry.label ?? newEntry.value),
        });
    }
    return newEntries;
}
function assignStyle(el, style) {
    Object.assign(el.style, style);
}
function dataToDatasetString(data) {
    return R.pipe(!R.isArray(data) ? R.entries(data) : data, R.map(([key, value]) => {
        if (R.isNullish(value))
            return;
        const sluggifiedKey = key.replace(/\B([A-Z])/g, "-$1").toLowerCase();
        const stringified = R.isObjectType(value) ? JSON.stringify(value) : value;
        return `data-${sluggifiedKey}='${stringified}'`;
    }), R.filter(R.isTruthy), R.join(" "));
}
function datasetToData(dataset) {
    const data = {};
    for (const [sluggifiedKey, stringValue] of R.entries(dataset)) {
        const key = game.pf2e.system.sluggify(sluggifiedKey, { camel: "dromedary" });
        try {
            data[key] = stringValue ? JSON.parse(stringValue) : undefined;
        }
        catch (error) {
            data[key] = stringValue;
        }
    }
    return data;
}
function firstElementWithText(el) {
    if (!(el instanceof HTMLElement))
        return null;
    const childNodes = el.childNodes;
    if (!childNodes.length)
        return null;
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
export { addListener, addListenerAll, arrayToSelectOptions, assignStyle, createHTMLElement, createHTMLElementContent, datasetToData, dataToDatasetString, firstElementWithText, htmlClosest, htmlQuery, htmlQueryAll, };
