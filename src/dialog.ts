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
import { htmlQuery, localize, localizeIfExist, MODULE, R, render, templateLocalize } from ".";
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

interface ModuleDialog extends DialogV2 {
    options: ModuleDialogConfiguration;
}

async function waitDialog<T extends Record<string, any>>(
    options: WaitDialogOptions & { returnOnFalse?: never },
): Promise<T | false | null>;
async function waitDialog<T extends Record<string, any>, K extends keyof T>(
    options: WaitDialogOptions & { returnOnFalse: K[] },
): Promise<T | Pick<T, K> | null>;
async function waitDialog(options: WaitDialogOptions & { returnOnFalse?: string[] }) {
    const {
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
    } = options;

    if (data) {
        data.i18n = templateLocalize(i18n);
    }

    classes.push(MODULE.id);

    const dialogOptions: ModuleDialogOptions<DialogWaitOptions> = {
        buttons: [
            {
                action: "yes",
                icon: yes?.icon ?? "fa-solid fa-check",
                label: yes?.label ?? localize(i18n, "yes"),
                default: !no?.default,
                callback:
                    yes?.callback ??
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
                    if (!returnOnFalse) return false;

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
                if (focus) {
                    htmlQuery(dialog.element, `[name="${focus}"]`)?.focus();
                } else {
                    htmlQuery(dialog.element, `input[type="text"]`)?.focus();
                }
            });

            if (onRender) {
                onRender(event, dialog);
            }
        },
    };

    return ModuleDialog.wait(dialogOptions);
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
    }: ConfirmDialogOptions = {},
): Promise<boolean | null> {
    const options: ModuleDialogOptions<DialogConfirmOptions> = {
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

async function promptDialog(key: string, data: Record<string, string> = {}) {
    return ModuleDialog.prompt({
        content: localize(key, "content", data),
        window: {
            title: localize(key, "title", data),
        },
    });
}

function createFormData<E extends HTMLFormElement>(
    html: E,
    options?: CreateFormDataOptions,
): Record<string, unknown>;
function createFormData<E extends HTMLElement | HTMLFormElement>(
    html: E,
    options?: CreateFormDataOptions,
): Record<string, unknown> | null;
function createFormData(
    html: HTMLElement | HTMLFormElement,
    { expand = false, disabled, readonly }: CreateFormDataOptions = {},
): Record<string, unknown> | null {
    const form = html instanceof HTMLFormElement ? html : htmlQuery(html, "form");
    if (!form) return null;

    const formData = new foundry.applications.ux.FormDataExtended(form, { disabled, readonly });
    const data = R.mapValues(formData.object, (value) => {
        return typeof value === "string" ? value.trim() : value;
    });

    for (const element of form.elements) {
        if (!(element instanceof HTMLInputElement) || element.type !== "file") continue;

        data[element.name] = element.files?.[0];
    }

    return expand ? (foundry.utils.expandObject(data) as Record<string, unknown>) : data;
}

function generateDialogTitle(
    i18n: string,
    title: string | Record<string, any> | undefined,
    data: Record<string, any> | undefined,
): string {
    return R.isString(title)
        ? title
        : localize(i18n, "title", R.isObjectType(title) ? title : (data ?? {}));
}

async function generateDialogContent(content: string, data?: Record<string, any>): Promise<string> {
    if (R.isObjectType(data)) {
        return render(content, data);
    } else {
        return content.startsWith("<") ? content : `<div>${content}</div>`;
    }
}

type CreateFormDataOptions = {
    expand?: boolean;
    disabled?: boolean;
    readonly?: boolean;
};

type ModuleDialogConfiguration = ApplicationConfiguration &
    DialogV2Configuration & {
        skipAnimate?: boolean;
        minWidth?: string;
    };

type ModuleDialogOptions<T extends DeepPartial<ApplicationConfiguration & DialogV2Configuration>> =
    DeepPartial<T> & {
        skipAnimate?: boolean;
        minWidth?: string;
    };

type BaseDialogOptions = {
    classes?: string[];
    data?: Record<string, any>;
    position?: Partial<ApplicationPosition>;
    skipAnimate?: boolean;
    minWidth?: string;
    title?: string | Record<string, any>;
};

type ConfirmDialogOptions = BaseDialogOptions & {
    content?: string;
    no?: string;
    yes?: { label?: string; default?: true };
};

type WaitDialogOptions = BaseDialogOptions &
    CreateFormDataOptions & {
        content: string;
        focus?: string;
        i18n: string;
        no?: { label?: string; icon?: string; default?: true };
        onRender?: DialogV2RenderCallback;
        yes?: {
            label?: string;
            icon?: string;
            callback?: foundry.applications.api.DialogV2ButtonCallback;
        };
    };

export { confirmDialog, createFormData, promptDialog, waitDialog };
