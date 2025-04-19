import { joinStr, localize, MODULE } from ".";
function templatePath(...path) {
    return `modules/${MODULE.id}/templates/${joinStr("/", path)}.hbs`;
}
function render(template, data, { i18n } = {}) {
    if (i18n) {
        data.i18n = templateLocalize(i18n);
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
            value: (...keys) => {
                const tooltip = localize(...subKeys, ...keys);
                return `data-tooltip aria-label="${tooltip}"`;
            },
            enumerable: false,
            configurable: false,
        },
    });
    return fn;
}
export { render, templateLocalize, templatePath };
