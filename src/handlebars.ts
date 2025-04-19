import { HelperDelegate, HelperOptions } from "handlebars";
import { joinStr, localize, LocalizeData, MODULE } from ".";

function templatePath(...path: string[]): string {
    return `modules/${MODULE.id}/templates/${joinStr("/", path)}.hbs`;
}

function render<TData extends RenderTemplateData>(
    template: string | string[],
    data: TData,
    { i18n }: RenderTemplateOptions = {}
): Promise<string> {
    if (i18n) {
        (data as any).i18n = templateLocalize(i18n);
    }

    const path = templatePath(...[template].flat());
    return foundry.applications.handlebars.renderTemplate(path, data);
}

function templateLocalize(...subKeys: string[]) {
    const fn = (...args: Parameters<HelperDelegate>) => {
        const { hash } = args.pop() as HelperOptions;
        return localize(...subKeys, ...(args as string[]), hash as LocalizeData);
    };

    Object.defineProperties(fn, {
        tooltip: {
            value: (...keys: string[]) => {
                const tooltip = localize(...subKeys, ...keys);
                return `data-tooltip aria-label="${tooltip}"`;
            },
            enumerable: false,
            configurable: false,
        },
    });

    return fn;
}

type RenderTemplateData = Record<string, any>;
type RenderTemplateOptions = { i18n?: string };

type TemplateLocalize = ReturnType<typeof templateLocalize>;

export { render, templateLocalize, templatePath };
export type { RenderTemplateData, RenderTemplateOptions, TemplateLocalize };
