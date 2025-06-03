import {
    ApplicationClosingOptions,
    ApplicationConfiguration,
    ApplicationPosition,
    ApplicationRenderOptions,
} from "foundry-pf2e/foundry/client-esm/applications/_types.js";
import {
    DialogV2Configuration,
    DialogV2RenderCallback,
} from "foundry-pf2e/foundry/client-esm/applications/api/dialog.js";
import {
    createFormData,
    CreateFormGroupParams,
    createFormTemplate,
    htmlQuery,
    MODULE,
    R,
    render,
    templateLocalize,
} from ".";
import { localize, localizeIfExist } from "./localize";
import DialogV2 = foundry.applications.api.DialogV2;

class ModuleDialog extends DialogV2 {
    get skipAnimate() {
        return this.options.skipAnimate === true;
    }

    async close(options: ApplicationClosingOptions = {}) {
        return super.close({
            ...options,
            animate: options.animate ?? !this.skipAnimate,
        });
    }

    _replaceHTML(result: unknown, content: HTMLElement, options: ApplicationRenderOptions) {
        super._replaceHTML(result, content, options);
        content.style.minWidth = this.options.minWidth ?? "400px";
    }
}

async function waitDialog<T extends Record<string, any>>(
    options: WaitDialogOptions & { returnOnFalse?: never }
): Promise<T | false | null>;
async function waitDialog<T extends Record<string, any>, K extends keyof T>(
    options: WaitDialogOptions & { returnOnFalse: K[] }
): Promise<T | Pick<T, K> | null>;
async function waitDialog({
    classes = [],
    content,
    data,
    focus,
    i18n,
    minWidth,
    no,
    onRender,
    position = {},
    returnOnFalse,
    skipAnimate,
    title,
    yes,
}: WaitDialogOptions & { returnOnFalse?: string[] }) {
    if (data) {
        data.i18n = templateLocalize(i18n);
    }

    classes.push(MODULE.id);

    const options: ModuleDialogOptions<DialogWaitOptions> = {
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
                callback: async (event, btn, dialog) => {
                    if (!returnOnFalse) return false;

                    const data = createFormData(dialog.element);
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
            } else {
                htmlQuery(dialog.element, `input[type="text"]`)?.focus();
            }

            if (onRender) {
                onRender(event, dialog);
            }
        },
    };

    return ModuleDialog.wait(options);
}

async function confirmDialog(
    i18n: string,
    {
        classes = [],
        content,
        data = {},
        minWidth,
        no,
        position = {},
        skipAnimate,
        title,
        yes,
    }: ConfirmDialogOptions = {}
): Promise<boolean | null> {
    const options: ModuleDialogOptions<DialogConfirmOptions> = {
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

async function generateDialogContent(
    content: string | CreateFormGroupParams[],
    i18n: string,
    data?: Record<string, any>
): Promise<string> {
    if (R.isString(content)) {
        if (R.isObjectType(data)) {
            return render(content, data);
        } else {
            return content.startsWith("<") ? content : `<div>${content}</div>`;
        }
    }

    return createFormTemplate(i18n, content);
}

interface ModuleDialog extends DialogV2 {
    options: ModuleDialogConfiguration;
}

type ModuleDialogConfiguration = ApplicationConfiguration &
    DialogV2Configuration & {
        skipAnimate?: boolean;
        minWidth?: string;
    };

type ModuleDialogOptions<T extends DeepPartial<ApplicationConfiguration & DialogV2Configuration>> =
    T & {
        skipAnimate?: boolean;
        minWidth?: string;
    };

type BaseDialogOptions = {
    classes?: string[];
    data?: Record<string, any>;
    position?: Partial<ApplicationPosition>;
    skipAnimate?: boolean;
    minWidth?: string;
    title?: string;
};

type ConfirmDialogOptions = BaseDialogOptions & {
    content?: string;
    no?: string;
    yes?: { label?: string; default?: true };
};

type WaitDialogOptions = BaseDialogOptions & {
    content: string | CreateFormGroupParams[];
    focus?: string;
    i18n: string;
    no?: { label?: string; icon?: string; default?: true };
    onRender?: DialogV2RenderCallback;
    yes?: { label?: string; icon?: string };
};

export { confirmDialog, waitDialog };
