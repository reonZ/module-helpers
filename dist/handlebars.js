import { MODULE } from "./module";
import { joinStr } from "./utils";
function templatePath(...path) {
    return `modules/${MODULE.id}/templates/${joinStr("/", path)}.hbs`;
}
function imagePath(...args) {
    const ext = args.pop();
    return `modules/${MODULE.id}/images/${joinStr("/", args)}.${ext}`;
}
function render(...args) {
    const data = typeof args.at(-1) === "object" ? args.pop() : {};
    const path = templatePath(...args);
    return renderTemplate(path, data);
}
function arrayToSelect(values, localize) {
    const entries = [];
    const localizer = typeof localize === "function"
        ? localize
        : localize === true
            ? game.i18n.localize.bind(game.i18n)
            : (label) => label;
    for (const value of values) {
        const entry = typeof value === "string" ? { value, label: value } : value;
        entries.push({
            value: entry.value,
            label: localizer(entry.label ?? entry.value),
        });
    }
    return entries;
}
export { arrayToSelect, imagePath, render, templatePath };
