import { HelperDelegate, HelperOptions } from "handlebars";
import { joinStr, localize, LocalizeData, MODULE, R } from ".";

function templatePath(...path: string[]): string {
    return `modules/${MODULE.id}/templates/${joinStr("/", path)}.hbs`;
}

function imagePath(...args: [...string[], "svg" | "webp"]): ImageFilePath {
    const ext = args.pop();
    return `modules/${MODULE.id}/images/${joinStr("/", args)}.${ext}` as ImageFilePath;
}

function render<TData extends RenderTemplateData>(
    template: string | string[],
    data: TData
): Promise<string> {
    if (R.isString(data.i18n)) {
        data.i18n = templateLocalize(data.i18n);
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
            value: (...args: Parameters<HelperDelegate>) => {
                const { hash } = args.pop() as HelperOptions;
                return templateTooltip(...subKeys, ...(args as string[]), hash);
            },
            enumerable: false,
            configurable: false,
        },
    });

    return fn;
}

function templateTooltip(...args: [...string[], TemplateToolipOptions]) {
    const options = args[0] as TemplateToolipOptions;
    const tooltip = options.localize !== false ? localize(...args) : args[0];
    return `data-tooltip="${tooltip}"`;
    // return `data-tooltip="${tooltip}" aria-label="${tooltip}"`;
}

type RenderTemplateData = Record<string, any> & { i18n?: string | TemplateLocalize };

type TemplateLocalize = ReturnType<typeof templateLocalize>;

type TemplateToolipOptions = LocalizeData & { localize?: boolean };

export { imagePath, render, templateLocalize, templatePath, templateTooltip };
export type { RenderTemplateData, TemplateLocalize };
