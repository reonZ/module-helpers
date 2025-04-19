/// <reference types="foundry-pf2e/node_modules/handlebars" />
import { HelperOptions } from "handlebars";
declare function templatePath(...path: string[]): string;
declare function render<TData extends RenderTemplateData>(template: string | string[], data: TData, { i18n }?: RenderTemplateOptions): Promise<string>;
declare function templateLocalize(...subKeys: string[]): (context?: any, arg1?: any, arg2?: any, arg3?: any, arg4?: any, arg5?: any, options?: HelperOptions | undefined) => string;
type RenderTemplateData = Record<string, any>;
type RenderTemplateOptions = {
    i18n?: string;
};
type TemplateLocalize = ReturnType<typeof templateLocalize>;
export { render, templateLocalize, templatePath };
export type { RenderTemplateData, RenderTemplateOptions, TemplateLocalize };
