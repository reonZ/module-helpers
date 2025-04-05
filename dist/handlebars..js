import { MODULE, joinStr } from ".";
function templatePath(...path) {
    return `modules/${MODULE.id}/templates/${joinStr("/", path)}.hbs`;
}
function render(...args) {
    const data = typeof args.at(-1) === "object" ? args.pop() : {};
    const path = templatePath(...args);
    return renderTemplate(path, data);
}
export { render };
