import { MODULE, joinStr, localize } from ".";
function templatePath(...path) {
    return `modules/${MODULE.id}/templates/${joinStr("/", path)}.hbs`;
}
function render(template, data, { i18n } = {}) {
    if (i18n) {
        data.i18n = templateLocalize(i18n);
    }
    const path = templatePath(...[template].flat());
    return renderTemplate(path, data);
}
function templateLocalize(...args) {
    const fn = (...params) => {
        const { hash } = params.pop();
        return localize(...args, ...params, hash);
    };
    Object.defineProperties(fn, {
        path: {
            value: (...params) => {
                return MODULE.path(...args, ...params);
            },
            enumerable: false,
            configurable: false,
        },
    });
    return fn;
}
export { render, templateLocalize };
