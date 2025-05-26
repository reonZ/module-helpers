import { arrayToSelectOptions, htmlQuery, I18n, R } from ".";
var fields = foundry.applications.fields;
function createFormData(html, { expand = false, disabled, readonly } = {}) {
    const form = html instanceof HTMLFormElement ? html : htmlQuery(html, "form");
    if (!form)
        return null;
    const formData = new foundry.applications.ux.FormDataExtended(form, { disabled, readonly });
    const data = R.mapValues(formData.object, (value) => {
        return typeof value === "string" ? value.trim() : value;
    });
    for (const element of form.elements) {
        if (!(element instanceof HTMLInputElement) || element.type !== "file")
            continue;
        data[element.name] = element.files?.[0];
    }
    return expand ? foundry.utils.expandObject(data) : data;
}
function generateFormInput(type, i18n, inputConfig) {
    const _i18n = I18n.from(inputConfig.i18n) ?? i18n;
    if (type === "text") {
        const configs = inputConfig;
        return fields.createTextInput({
            ...configs,
            value: "value" in configs ? String(configs.value) : "",
            placeholder: configs.placeholder ?? _i18n.localizeIfExist("placeholder"),
        });
    }
    else if (type === "select") {
        const configs = inputConfig;
        if (configs.options.length <= 1) {
            configs.disabled = true;
        }
        return fields.createSelectInput({
            ...configs,
            options: arrayToSelectOptions(configs.options, _i18n),
        });
    }
}
function createFormGroup(type, inputConfig, groupConfig) {
    const i18n = I18n.from(groupConfig.i18n);
    groupConfig.input = generateFormInput(type, i18n, inputConfig);
    groupConfig.hint ??= i18n.localizeIfExist("hint");
    groupConfig.label ??= i18n.localize("label");
    return fields.createFormGroup(groupConfig).outerHTML;
}
function createFormTemplate(i18n, groups) {
    const _i18n = I18n.from(i18n);
    return R.pipe(groups, R.map(({ type, inputConfig, groupConfig }) => {
        const config = {
            ...groupConfig,
            i18n: (I18n.from(groupConfig?.i18n) ?? _i18n).clone(inputConfig.name),
        };
        return createFormGroup(type, inputConfig, config);
    }), R.join(""));
}
export { createFormData, createFormTemplate };
