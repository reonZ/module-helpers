/// <reference types="foundry-pf2e/node_modules/handlebars" />
import { HelperOptions } from "handlebars";
import { LocalizeData } from ".";
declare function templatePath(...path: string[]): string;
declare function imagePath(...args: [...string[], "svg" | "webp"]): ImageFilePath;
declare function render<TData extends RenderTemplateData>(template: string | string[], data: TData): Promise<string>;
declare function templateLocalize(...subKeys: string[]): (context?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any, options?: HelperOptions | undefined) => string;
declare function templateTooltip(...args: [...string[], TemplateToolipOptions]): string;
type RenderTemplateData = Record<string, any> & {
    i18n?: string | TemplateLocalize;
};
type TemplateLocalize = ReturnType<typeof templateLocalize>;
type TemplateToolipOptions = LocalizeData & {
    localize?: boolean;
};
export { imagePath, render, templateLocalize, templatePath, templateTooltip };
export type { RenderTemplateData, TemplateLocalize };
