import { HelperDelegate, HelperOptions } from "handlebars";
import { LocalizeData, MODULE, joinStr, localize } from ".";

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
    return renderTemplate(path, data);
}

function templateLocalize(...args: string[]) {
    const fn = (...params: Parameters<HelperDelegate>) => {
        const { hash } = params.pop() as HelperOptions;
        return localize(...args, ...(params as string[]), hash as LocalizeData);
    };

    Object.defineProperties(fn, {
        path: {
            value: (...params: string[]) => {
                return MODULE.path(...args, ...params);
            },
            enumerable: false,
            configurable: false,
        },
    });

    return fn;
}

type RenderTemplateData = Record<string, any>;
type RenderTemplateOptions = { i18n?: string };

export { render, templateLocalize };
export type { RenderTemplateData, RenderTemplateOptions };
