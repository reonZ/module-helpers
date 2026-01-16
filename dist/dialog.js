import { htmlQuery, localize, localizeIfExist, MODULE, R, render, templateLocalize } from ".";
var DialogV2 = foundry.applications.api.DialogV2;
class ModuleDialog extends DialogV2 {
    get skipAnimate() {
        return this.options.skipAnimate === true;
    }
    async close(options = {}) {
        return super.close({
            ...options,
            animate: options.animate ?? !this.skipAnimate,
        });
    }
    _replaceHTML(result, content, options) {
        super._replaceHTML(result, content, options);
        content.style.minWidth = this.options.minWidth ?? "400px";
    }
}
async function waitDialog(options) {
    const { classes = [], content, data, focus, i18n, minWidth, no, onRender, position = {}, returnOnFalse, skipAnimate, title, yes, } = options;
    if (data) {
        data.i18n = templateLocalize(i18n);
    }
    classes.push(MODULE.id);
    const dialogOptions = {
        buttons: [
            {
                action: "yes",
                icon: yes?.icon ?? "fa-solid fa-check",
                label: yes?.label ?? localize(i18n, "yes"),
                default: !no?.default,
                callback: yes?.callback ??
                    (async (event, btn, dialog) => {
                        return createFormData(dialog.element, options);
                    }),
            },
            {
                action: "no",
                icon: no?.icon ?? "fa-solid fa-xmark",
                label: no?.label ?? localizeIfExist(i18n, "no") ?? "Cancel",
                default: !!no?.default,
                callback: async (event, btn, dialog) => {
                    if (!returnOnFalse)
                        return false;
                    const data = createFormData(dialog.element, options);
                    return data ? R.pick(data, returnOnFalse) : null;
                },
            },
        ],
        classes,
        content: await generateDialogContent(content, data),
        minWidth,
        position,
        skipAnimate,
        window: {
            title: generateDialogTitle(i18n, title, data),
        },
        render: (event, dialog) => {
            requestAnimationFrame(() => {
                htmlQuery(dialog.element, `input[type="text"]`)?.focus();
                if (focus) {
                    htmlQuery(dialog.element, `[name="${focus}"]`)?.focus();
                }
            });
            if (onRender) {
                onRender(event, dialog);
            }
        },
    };
    return ModuleDialog.wait(dialogOptions);
}
async function confirmDialog(i18n, { classes = [], content, data = {}, minWidth, no, position = {}, skipAnimate, title, yes, } = {}) {
    const options = {
        classes,
        content: content ?? localize(i18n, "content", data),
        minWidth,
        no: {
            default: !yes?.default,
            label: no ?? localizeIfExist(i18n, "no") ?? "No",
        },
        position,
        skipAnimate,
        window: {
            title: generateDialogTitle(i18n, title, data),
        },
        yes: {
            default: !!yes?.default,
            label: yes?.label ?? localizeIfExist(i18n, "yes") ?? "Yes",
        },
    };
    return ModuleDialog.confirm(options);
}
async function promptDialog(key, data = {}) {
    return ModuleDialog.prompt({
        content: localize(key, "content", data),
        window: {
            title: localize(key, "title", data),
        },
    });
}
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
function generateDialogTitle(i18n, title, data) {
    return R.isString(title) ? title : localize(i18n, "title", R.isObjectType(title) ? title : (data ?? {}));
}
async function generateDialogContent(content, data) {
    if (R.isObjectType(data)) {
        return render(content, data);
    }
    else {
        return content.startsWith("<") ? content : `<div>${content}</div>`;
    }
}
export { confirmDialog, createFormData, promptDialog, waitDialog };
