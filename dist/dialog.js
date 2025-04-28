import { createFormData, createFormTemplate, htmlQuery, MODULE, R, render, templateLocalize, } from ".";
import { localize, localizeIfExist } from "./localize";
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
        content.style.minWidth = "400px";
    }
}
async function waitDialog({ content, classes = [], data, focus, i18n, no, position = {}, onRender, skipAnimate, title, yes, }) {
    if (data) {
        data.i18n = templateLocalize(i18n);
    }
    classes.push(MODULE.id);
    classes.push(i18n);
    const options = {
        buttons: [
            {
                action: "yes",
                icon: yes?.icon ?? "fa-solid fa-check",
                label: yes?.label ?? localize(i18n, "yes"),
                default: !no?.default,
                callback: async (event, btn, dialog) => {
                    return createFormData(dialog.element);
                },
            },
            {
                action: "no",
                icon: no?.icon ?? "fa-solid fa-xmark",
                label: no?.label ?? localizeIfExist(i18n, "no") ?? "Cancel",
                default: !!no?.default,
                callback: async () => false,
            },
        ],
        classes,
        content: await generateDialogContent(content, i18n, data),
        position,
        skipAnimate,
        window: {
            title: title ?? localize(i18n, "title"),
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
async function confirmDialog(i18n, { classes = [], content, data = {}, no, position = {}, skipAnimate, title, yes, } = {}) {
    const options = {
        classes,
        content: await generateDialogContent(content ?? localize(i18n, "content", data), i18n),
        no: {
            default: !yes?.default,
            label: no ?? localizeIfExist(i18n, "no") ?? "No",
        },
        position,
        skipAnimate,
        window: {
            title: title ?? localize(i18n, "title"),
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
