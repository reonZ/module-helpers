import { createFormData, htmlQuery } from ".";
import { render } from "./handlebars";
const DialogV2 = foundry.applications.api.DialogV2;
let AnimationlessDialog = null;
function getDialogClass(animation = true) {
    if (animation) {
        return DialogV2;
    }
    AnimationlessDialog ??= class extends DialogV2 {
        async close(options) {
            return super.close({ animate: false });
        }
    };
    return AnimationlessDialog;
}
async function waitDialog({ title, content, yes, no, classes, data, render, focus, }, { id, width, animation, top } = {}) {
    content = await assureDialogContent(content, data);
    const dialogRender = !render && !focus
        ? undefined
        : (event, html) => {
            if (focus) {
                htmlQuery(html, focus)?.focus();
            }
            if (render) {
                render(event, html);
            }
        };
    const buttons = [
        {
            action: "yes",
            icon: yes.icon ?? "fa-solid fa-check",
            label: yes.label,
            default: !no.default,
            callback: typeof yes.callback === "function"
                ? yes.callback
                : async (event, btn, html) => {
                    return createFormData(html);
                },
        },
        {
            action: "no",
            icon: no.icon ?? "fa-solid fa-xmark",
            label: no.label,
            default: no.default,
            callback: typeof no.callback === "function" ? no.callback : async () => false,
        },
    ];
    const options = {
        window: {
            title,
            contentClasses: classes ?? [],
        },
        position: { width, top },
        content,
        rejectClose: false,
        buttons,
        render: dialogRender,
        close: () => { },
    };
    if (id)
        options.id = id;
    return getDialogClass(animation).wait(options);
}
async function confirmDialog({ title, content, classes, data }, { animation } = {}) {
    content = await assureDialogContent(content, data);
    return getDialogClass(animation).confirm({
        window: { title, contentClasses: classes ?? [] },
        content,
        rejectClose: false,
        yes: { default: true },
        no: { default: false },
    });
}
async function promptDialog({ title, content, classes, data, label, render, callback, }, { width, id, animation, top } = {}) {
    content = await assureDialogContent(content, data);
    const ok = {
        callback: typeof callback === "function"
            ? callback
            : async (event, btn, html) => {
                return createFormData(html);
            },
    };
    if (label)
        ok.label = label;
    const options = {
        content,
        window: { title, contentClasses: classes ?? [] },
        position: { width, top },
        rejectClose: false,
        render,
        ok,
    };
    if (id)
        options.id = id;
    return getDialogClass(animation).prompt(options);
}
async function assureDialogContent(content, data) {
    content = typeof data === "object" ? await render(content, data) : content;
    return content.startsWith("<") ? content : `<div>${content}</div>`;
}
export { confirmDialog, promptDialog, waitDialog };
