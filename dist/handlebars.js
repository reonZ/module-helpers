import { htmlQuery, joinStr, localize, MODULE, R, SYSTEM } from ".";
function templatePath(...path) {
    return `modules/${MODULE.id}/templates/${joinStr("/", path)}.hbs`;
}
function imagePath(...args) {
    const ext = args.pop();
    return `modules/${MODULE.id}/images/${joinStr("/", args)}.${ext}`;
}
function render(template, data = {}) {
    template = template.replace(/\./, "/");
    if (R.isString(data.i18n)) {
        data.i18n = templateLocalize(data.i18n);
    }
    else if (!("i18n" in data)) {
        data.i18n = templateLocalize(template.replace(/\//, "."));
    }
    data.isSF2e ??= SYSTEM.isSF2e;
    const path = templatePath(template);
    return foundry.applications.handlebars.renderTemplate(path, data);
}
function templateLocalize(...subKeys) {
    const fn = (...args) => {
        const { hash } = args.pop();
        return localize(...subKeys, ...args, hash);
    };
    Object.defineProperties(fn, {
        tooltip: {
            value: (...args) => {
                const { hash } = args.pop();
                return templateTooltip(...subKeys, ...args, hash);
            },
            enumerable: false,
            configurable: false,
        },
        root: {
            value: (...args) => {
                const { hash } = args.pop();
                return localize(...args, hash);
            },
            enumerable: false,
            configurable: false,
        },
    });
    return fn;
}
function templateTooltip(...args) {
    const options = args[0];
    const tooltip = options.localize !== false ? localize(...args) : args[0];
    return `data-tooltip="${tooltip}"`;
    // return `data-tooltip="${tooltip}" aria-label="${tooltip}"`;
}
function preSyncElement(newElement, priorElement, ...scrollable) {
    const state = { focus: undefined, scrollPositions: [] };
    if (!priorElement) {
        return state;
    }
    const focus = priorElement.querySelector(":focus");
    if (focus?.name) {
        state.focus = `${focus.tagName}[name="${focus.name}"]`;
    }
    else if (focus?.dataset.itemId) {
        state.focus = `${focus.tagName}[data-item-id="${focus.dataset.itemId}"]`;
    }
    if (scrollable.length === 0) {
        scrollable.push("");
    }
    for (const selector of scrollable) {
        const el0 = selector === "" ? priorElement : htmlQuery(priorElement, selector);
        if (el0) {
            const el1 = selector === "" ? newElement : htmlQuery(newElement, selector);
            if (el1) {
                state.scrollPositions.push([el1, el0.scrollTop]);
            }
        }
    }
    return state;
}
function postSyncElement(newElement, state) {
    if (state.focus) {
        const newFocus = htmlQuery(newElement, state.focus);
        newFocus?.focus();
    }
    for (const [el, scrollTop] of state.scrollPositions) {
        el.scrollTop = scrollTop;
    }
}
export { imagePath, preSyncElement, render, postSyncElement, templateLocalize, templatePath, templateTooltip };
