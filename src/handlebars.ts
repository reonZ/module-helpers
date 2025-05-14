import { HelperDelegate, HelperOptions } from "handlebars";
import { joinStr, localize, LocalizeArgs, LocalizeData, MODULE, R } from ".";
import { ApplicationConfiguration } from "foundry-pf2e/foundry/client-esm/applications/_types.js";

function templatePath(...path: string[]): string {
    return `modules/${MODULE.id}/templates/${joinStr("/", path)}.hbs`;
}

function imagePath(...args: [...string[], "svg" | "webp"]): ImageFilePath {
    const ext = args.pop();
    return `modules/${MODULE.id}/images/${joinStr("/", args)}.${ext}` as ImageFilePath;
}

function render<TData extends RenderTemplateData>(
    template: string,
    data = {} as TData
): Promise<string> {
    if (R.isString(data.i18n)) {
        data.i18n = templateLocalize(data.i18n);
    } else if (!("i18n" in data)) {
        data.i18n = templateLocalize(template.replace(/\//, "."));
    }

    const path = templatePath(template);
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

function setApplicationTitle(
    options: DeepPartial<ApplicationConfiguration>,
    ...args: LocalizeArgs
) {
    const title = localize(...args);
    foundry.utils.setProperty(options, "window.title", title);
}

type RenderTemplateData = Record<string, any> & { i18n?: string | TemplateLocalize };

type TemplateLocalize = ReturnType<typeof templateLocalize>;

type TemplateToolipOptions = LocalizeData & { localize?: boolean };

export { imagePath, render, setApplicationTitle, templateLocalize, templatePath, templateTooltip };
export type { RenderTemplateData, TemplateLocalize };
