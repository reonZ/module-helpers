/// <reference types="foundry-pf2e/node_modules/handlebars" />
import { HelperOptions } from "handlebars";
import { LocalizeArgs, LocalizeData } from ".";
import { ApplicationConfiguration } from "foundry-pf2e/foundry/client-esm/applications/_types.js";
declare function templatePath(...path: string[]): string;
declare function imagePath(...args: [...string[], "svg" | "webp"]): ImageFilePath;
declare function render<TData extends RenderTemplateData>(template: string, data?: TData): Promise<string>;
declare function templateLocalize(...subKeys: string[]): (context?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any, options?: HelperOptions | undefined) => string;
declare function templateTooltip(...args: [...string[], TemplateToolipOptions]): string;
declare function setApplicationTitle(options: DeepPartial<ApplicationConfiguration>, ...args: LocalizeArgs): void;
type RenderTemplateData = Record<string, any> & {
    i18n?: string | TemplateLocalize;
};
type TemplateLocalize = ReturnType<typeof templateLocalize>;
type TemplateToolipOptions = LocalizeData & {
    localize?: boolean;
};
export { imagePath, render, setApplicationTitle, templateLocalize, templatePath, templateTooltip };
export type { RenderTemplateData, TemplateLocalize };
