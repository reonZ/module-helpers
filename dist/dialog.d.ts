import { DialogV2Button, DialogV2ButtonCallback, DialogV2RenderCallback } from "foundry-pf2e/foundry/client-esm/applications/api/dialog.js";
declare function waitDialog<T extends any>({ title, content, yes, no, classes, data, render, }: BaseOptions & {
    yes: Omit<DialogV2Button, "action">;
    no: Omit<DialogV2Button, "action">;
}, { id, width, animation, top }?: DialogExtraOptions): Promise<T | null | false>;
declare function confirmDialog({ title, content, classes, data }: BaseOptions, { animation }?: {
    animation?: boolean;
}): Promise<boolean | null>;
declare function promptDialog<T extends Record<string, unknown>>({ title, content, classes, data, label, render, callback, }: BaseOptions & {
    label?: string;
    callback?: DialogV2ButtonCallback;
}, { width, id, animation, top }?: DialogExtraOptions): Promise<T | null>;
type DialogExtraOptions = {
    id?: string;
    width?: number;
    animation?: false;
    top?: number;
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
