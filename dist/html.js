import { R } from ".";
function createHTMLElement(nodeName, { classes = [], dataset = {}, content, id } = {}) {
    const element = document.createElement(nodeName);
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
    else if (content) {
        element.append(...content);
    }
    return element;
}
function createHTMLButton({ icon, label, action, type }) {
    const button = document.createElement("button");
    button.type = type ?? "button";
    button.innerHTML = `<i class="${icon}"></i> ${label}`;
    if (action) {
        button.dataset.action = action;
    }
    return button;
}
function createHTMLButtons(data, wrapperClass = "buttons") {
    const wrapper = document.createElement("div");
    wrapper.classList.add(wrapperClass);
    for (const entry of data) {
        const button = createHTMLButton(entry);
        wrapper.appendChild(button);
    }
    return wrapper;
}
function htmlQuery(parent, selectors) {
    if (!(parent instanceof Element || parent instanceof Document))
        return null;
    return parent.querySelector(selectors);
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
    element.addEventListener(event, (e) => listener(e, element), useCapture);
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
        element.addEventListener(event, (e) => listener(e, element), useCapture);
    }
}
function htmlClosest(child, selectors) {
    if (!(child instanceof Element))
        return null;
    return child.closest(selectors);
}
function arrayToSelectOptions(entries, i18n) {
    const newEntries = [];
    const localizer = i18n?.localize.bind(i18n) ?? game.i18n.localize.bind(game.i18n);
    for (const entry of entries) {
        const newEntry = typeof entry === "string" ? { value: entry, label: entry } : entry;
        newEntries.push({
            ...newEntry,
            value: newEntry.value,
            label: localizer(newEntry.label ?? newEntry.value),
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
        return `data-${sluggifiedKey}="${stringified}"`;
    }), R.filter(R.isTruthy), R.join(" "));
}
export { addListener, addListenerAll, arrayToSelectOptions, assignStyle, createHTMLButton, createHTMLButtons, createHTMLElement, dataToDatasetString, htmlClosest, htmlQuery, };
