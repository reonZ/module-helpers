import { ApplicationPosition } from "foundry-pf2e/foundry/client-esm/applications/_types.js";
import { DialogV2RenderCallback } from "foundry-pf2e/foundry/client-esm/applications/api/dialog.js";
import { CreateFormGroupParams } from ".";
declare function waitDialog<T extends Record<string, any>>({ content, classes, data, focus, i18n, no, position, onRender, skipAnimate, title, yes, }: WaitDialogOptions): Promise<T | false | null>;
declare function confirmDialog(i18n: string, { classes, content, data, no, position, skipAnimate, title, yes, }?: ConfirmDialogOptions): Promise<boolean | null>;
type BaseDialogOptions = {
    classes?: string[];
    data?: Record<string, any>;
    position?: Partial<ApplicationPosition>;
    skipAnimate?: boolean;
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
    };
};
export { confirmDialog, waitDialog };
