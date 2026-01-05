import { ApplicationPosition } from "foundry-pf2e/foundry/client-esm/applications/_types.js";
import { DialogV2RenderCallback } from "foundry-pf2e/foundry/client-esm/applications/api/dialog.js";
declare function waitDialog<T extends Record<string, any>>(options: WaitDialogOptions & {
    returnOnFalse?: never;
}): Promise<T | false | null>;
declare function waitDialog<T extends Record<string, any>, K extends keyof T>(options: WaitDialogOptions & {
    returnOnFalse: K[];
}): Promise<T | Pick<T, K> | null>;
declare function confirmDialog(i18n: string, { classes, content, data, minWidth, no, position, skipAnimate, title, yes, }?: ConfirmDialogOptions): Promise<boolean | null>;
declare function promptDialog(key: string, data?: Record<string, string>): Promise<any>;
declare function createFormData<E extends HTMLFormElement>(html: E, options?: CreateFormDataOptions): Record<string, unknown>;
declare function createFormData<E extends HTMLElement | HTMLFormElement>(html: E, options?: CreateFormDataOptions): Record<string, unknown> | null;
type CreateFormDataOptions = {
    expand?: boolean;
    disabled?: boolean;
    readonly?: boolean;
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
    yes?: {
        label?: string;
        default?: true;
    };
};
type WaitDialogOptions = BaseDialogOptions & CreateFormDataOptions & {
    content: string;
    focus?: string;
    i18n: string;
    no?: {
        label?: string;
        icon?: string;
        default?: true;
    };
    onRender?: DialogV2RenderCallback;
    yes?: {
        label?: string;
        icon?: string;
        callback?: foundry.applications.api.DialogV2ButtonCallback;
    };
};
export { confirmDialog, createFormData, promptDialog, waitDialog };
