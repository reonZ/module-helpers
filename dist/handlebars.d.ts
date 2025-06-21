/// <reference types="foundry-pf2e/node_modules/handlebars" />
import { HelperOptions } from "handlebars";
import { LocalizeData } from ".";
declare function templatePath(...path: string[]): string;
declare function imagePath(...args: [...string[], "svg" | "webp"]): ImageFilePath;
declare function render<TData extends RenderTemplateData>(template: string, data?: TData): Promise<string>;
declare function templateLocalize(...subKeys: string[]): (context?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any, options?: HelperOptions | undefined) => string;
declare function templateTooltip(...args: [...string[], TemplateToolipOptions]): string;
declare function preSyncElement(newElement: HTMLElement, priorElement: Maybe<HTMLElement>, ...scrollable: string[]): SyncElementState;
declare function postSyncElement(newElement: HTMLElement, state: SyncElementState): void;
type SyncElementState = {
    focus?: string;
    scrollPositions: [HTMLElement, number][];
};
type RenderTemplateData = Record<string, any> & {
    i18n?: string | TemplateLocalize;
};
type TemplateLocalize = ReturnType<typeof templateLocalize>;
type TemplateToolipOptions = LocalizeData & {
    localize?: boolean;
};
export { imagePath, preSyncElement, render, postSyncElement, templateLocalize, templatePath, templateTooltip, };
export type { RenderTemplateData, SyncElementState, TemplateLocalize };
