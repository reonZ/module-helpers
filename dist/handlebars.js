import { joinStr, localize, MODULE, R } from ".";
function templatePath(...path) {
    return `modules/${MODULE.id}/templates/${joinStr("/", path)}.hbs`;
}
function render(template, data) {
    if (R.isString(data.i18n)) {
        data.i18n = templateLocalize(data.i18n);
    }
    const path = templatePath(...[template].flat());
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
export { render, templateLocalize, templatePath, templateTooltip };
