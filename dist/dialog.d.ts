import { ApplicationPosition } from "foundry-pf2e/foundry/client-esm/applications/_types.js";
import { DialogV2RenderCallback } from "foundry-pf2e/foundry/client-esm/applications/api/dialog.js";
import { CreateFormGroupParams } from ".";
declare function waitDialog<T extends Record<string, any>>(options: WaitDialogOptions & {
    returnOnFalse?: never;
}): Promise<T | false | null>;
declare function waitDialog<T extends Record<string, any>, K extends keyof T>(options: WaitDialogOptions & {
    returnOnFalse: K[];
}): Promise<T | Pick<T, K> | null>;
declare function confirmDialog(i18n: string, { classes, content, data, minWidth, no, position, skipAnimate, title, yes, }?: ConfirmDialogOptions): Promise<boolean | null>;
declare function promptDialog(key: string, data?: Record<string, string>): Promise<any>;
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
    yes?: {
        label?: string;
        default?: true;
    };
};
type WaitDialogOptions = BaseDialogOptions & {
    content: string | CreateFormGroupParams[];
    disabled?: boolean;
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
export { confirmDialog, promptDialog, waitDialog };
