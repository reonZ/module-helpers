import { htmlQuery, I18n, R } from ".";
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
    if (type === "checkbox") {
        const configs = inputConfig;
        return fields.createCheckboxInput({
            ...configs,
        });
    }
    else if (type === "number") {
        const configs = inputConfig;
        return fields.createNumberInput({
            ...configs,
            value: "value" in configs ? Number(configs.value) : 0,
        });
    }
    else if (type === "text") {
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
        const options = arrayToSelectOptions(configs.options, _i18n);
        return fields.createSelectInput({
            ...configs,
            options: configs.sort ? R.sortBy(options, R.prop("label")) : options,
        });
    }
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
export { arrayToSelectOptions, createFormData, createFormTemplate };
