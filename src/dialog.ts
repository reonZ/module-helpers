import { ApplicationClosingOptions } from "foundry-pf2e/foundry/client-esm/applications/_types.js";
import {
    DialogV2Button,
    DialogV2ButtonCallback,
    DialogV2PromptOptions,
    DialogV2RenderCallback,
    DialogV2WaitOptions,
} from "foundry-pf2e/foundry/client-esm/applications/api/application.js";
import { createFormData } from ".";
import { render } from "./handlebars";

const DialogV2 = foundry.applications.api.DialogV2;

let AnimationlessDialog: typeof DialogV2 | null = null;

function getDialogClass(animation = true): typeof DialogV2 {
    if (animation) {
        return DialogV2;
    }

    AnimationlessDialog ??= class extends DialogV2 {
        async close(options?: ApplicationClosingOptions) {
            return super.close({ animate: false });
        }
    };

    return AnimationlessDialog;
}

async function waitDialog<T extends any>(
    {
        title,
        content,
        yes,
        no,
        classes,
        data,
        render,
    }: BaseOptions & {
        yes: Omit<DialogV2Button, "action">;
        no: Omit<DialogV2Button, "action">;
    },
    { id, width, animation }: DialogExtraOptions = {}
): Promise<T | null | false> {
    content = await assureDialogContent(content, data);

    const buttons: DialogV2Button[] = [
        {
            action: "yes",
            icon: yes.icon ?? "fa-solid fa-check",
            label: yes.label,
            default: !no.default,
            callback:
                typeof yes.callback === "function"
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

    const options: DialogV2WaitOptions = {
        window: {
            title,
            contentClasses: classes ?? [],
        },
        position: { width },
        content,
        rejectClose: false,
        buttons,
        render,
        close: () => {},
    };

    if (id) options.id = id;

    return getDialogClass(animation).wait(options);
}

async function confirmDialog(
    { title, content, classes, data }: BaseOptions,
    { animation }: { animation?: boolean } = {}
) {
    content = await assureDialogContent(content, data);

    return getDialogClass(animation).confirm({
        window: { title, contentClasses: classes ?? [] },
        content,
        rejectClose: false,
        yes: { default: true },
        no: { default: false },
    });
}

async function promptDialog<T extends Record<string, unknown>>(
    {
        title,
        content,
        classes,
        data,
        label,
        render,
        callback,
    }: BaseOptions & { label?: string; callback?: DialogV2ButtonCallback },
    { width, id, animation }: DialogExtraOptions = {}
): Promise<T | null> {
    content = await assureDialogContent(content, data);

    const ok: DialogV2PromptOptions["ok"] = {
        callback:
            typeof callback === "function"
                ? callback
                : async (event, btn, html) => {
                      return createFormData(html);
                  },
    };

    if (label) ok.label = label;

    const options: DialogV2PromptOptions = {
        content,
        window: { title, contentClasses: classes ?? [] },
        position: { width },
        rejectClose: false,
        render,
        ok,
    };

    if (id) options.id = id;

    return getDialogClass(animation).prompt(options);
}

async function assureDialogContent(content: string, data?: Record<string, any>) {
    content = typeof data === "object" ? await render(content, data) : content;
    return content.startsWith("<") ? content : `<div>${content}</div>`;
}

type DialogExtraOptions = {
    id?: string;
    width?: number;
    animation?: false;
};

type BaseOptions = {
    title: string;
    content: string;
    classes?: string[];
    data?: Record<string, any>;
    render?: DialogV2RenderCallback;
};

export { confirmDialog, promptDialog, waitDialog };
export type { DialogExtraOptions };
