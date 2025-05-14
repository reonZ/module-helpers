import { joinStr, localize, MODULE, R } from ".";
function templatePath(...path) {
    return `modules/${MODULE.id}/templates/${joinStr("/", path)}.hbs`;
}
function imagePath(...args) {
    const ext = args.pop();
    return `modules/${MODULE.id}/images/${joinStr("/", args)}.${ext}`;
}
function render(template, data = {}) {
    if (R.isString(data.i18n)) {
        data.i18n = templateLocalize(data.i18n);
    }
    else if (!("i18n" in data)) {
        data.i18n = templateLocalize(template.replace(/\//, "."));
    }
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
    });
    return fn;
}
function templateTooltip(...args) {
    const options = args[0];
    const tooltip = options.localize !== false ? localize(...args) : args[0];
    return `data-tooltip="${tooltip}"`;
    // return `data-tooltip="${tooltip}" aria-label="${tooltip}"`;
}
function setApplicationTitle(options, ...args) {
    const title = localize(...args);
    foundry.utils.setProperty(options, "window.title", title);
}
export { imagePath, render, setApplicationTitle, templateLocalize, templatePath, templateTooltip };
