import { createFormData, createFormTemplate, htmlQuery, localize, localizeIfExist, MODULE, R, render, templateLocalize, } from ".";
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
async function waitDialog({ classes = [], content, data, 
// return value of disabled inputs too
disabled, focus, i18n, minWidth, no, onRender, position = {}, returnOnFalse, skipAnimate, title, yes, }) {
    if (data) {
        data.i18n = templateLocalize(i18n);
    }
    classes.push(MODULE.id);
    const options = {
        buttons: [
            {
                action: "yes",
                icon: yes?.icon ?? "fa-solid fa-check",
                label: yes?.label ?? localize(i18n, "yes"),
                default: !no?.default,
                callback: yes?.callback ??
                    (async (event, btn, dialog) => {
                        return createFormData(dialog.element, { disabled });
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
                    const data = createFormData(dialog.element, { disabled });
                    return data ? R.pick(data, returnOnFalse) : null;
                },
            },
        ],
        classes,
        content: await generateDialogContent(content, i18n, data),
        minWidth,
        position,
        skipAnimate,
        window: {
            title: title ?? localize(i18n, "title", data ?? {}),
        },
        render: (event, dialog) => {
            if (focus) {
                htmlQuery(dialog.element, `[name="${focus}"]`)?.focus();
            }
            else {
                htmlQuery(dialog.element, `input[type="text"]`)?.focus();
            }
            if (onRender) {
                onRender(event, dialog);
            }
        },
    };
    return ModuleDialog.wait(options);
}
async function confirmDialog(i18n, { classes = [], content, data = {}, minWidth, no, position = {}, skipAnimate, title, yes, } = {}) {
    const options = {
        classes,
        content: await generateDialogContent(content ?? localize(i18n, "content", data), i18n),
        minWidth,
        no: {
            default: !yes?.default,
            label: no ?? localizeIfExist(i18n, "no") ?? "No",
        },
        position,
        skipAnimate,
        window: {
            title: title ?? localize(i18n, "title", data),
        },
        yes: {
            default: !!yes?.default,
            label: yes?.label ?? localizeIfExist(i18n, "yes") ?? "Yes",
        },
    };
    return ModuleDialog.confirm(options);
}
async function generateDialogContent(content, i18n, data) {
    if (R.isString(content)) {
        if (R.isObjectType(data)) {
            return render(content, data);
        }
        else {
            return content.startsWith("<") ? content : `<div>${content}</div>`;
        }
    }
    return createFormTemplate(i18n, content);
}
export { confirmDialog, waitDialog };
