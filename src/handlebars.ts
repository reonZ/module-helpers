import { HelperDelegate, HelperOptions } from "handlebars";
import { htmlQuery, joinStr, localize, LocalizeData, MODULE, R, SYSTEM } from ".";

function templatePath(...path: string[]): string {
    return `modules/${MODULE.id}/templates/${joinStr("/", path)}.hbs`;
}

function imagePath(...args: [...string[], "svg" | "webp"]): ImageFilePath {
    const ext = args.pop();
    return `modules/${MODULE.id}/images/${joinStr("/", args)}.${ext}` as ImageFilePath;
}

function render<TData extends RenderTemplateData>(template: string, data = {} as TData): Promise<string> {
    template = template.replace(/\./, "/");

    if (R.isString(data.i18n)) {
        data.i18n = templateLocalize(data.i18n);
    } else if (!("i18n" in data)) {
        data.i18n = templateLocalize(template.replace(/\//, "."));
    }

    data.isSF2e ??= SYSTEM.isSF2e;
    data.systemId = SYSTEM.id;
    data.systemPartial = (path: string) => `systems/${SYSTEM.id}/templates/${path}`;

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
        root: {
            value: (...args: Parameters<HelperDelegate>) => {
                const { hash } = args.pop() as HelperOptions;
                return localize(...(args as string[]), hash as LocalizeData);
            },
            enumerable: false,
            configurable: false,
        },
    });

    return fn;
}

function templateTooltip(...args: [...string[], TemplateToolipOptions]): string {
    const options = args[0] as TemplateToolipOptions;
    const tooltip = options.localize !== false ? localize(...args) : args[0];
    return `data-tooltip="${tooltip}"`;
    // return `data-tooltip="${tooltip}" aria-label="${tooltip}"`;
}

function preSyncElement(
    newElement: HTMLElement,
    priorElement: Maybe<HTMLElement>,
    ...scrollable: string[]
): SyncElementState {
    const state: SyncElementState = { focus: undefined, scrollPositions: [] };

    if (!priorElement) {
        return state;
    }

    const focus = priorElement.querySelector<HTMLInputElement>(":focus");

    if (focus?.name) {
        state.focus = `${focus.tagName}[name="${focus.name}"]`;
    } else if (focus?.dataset.itemId) {
        state.focus = `${focus.tagName}[data-item-id="${focus.dataset.itemId}"]`;
    }

    if (scrollable.length === 0) {
        scrollable.push("");
    }

    for (const selector of scrollable) {
        const el0 = selector === "" ? priorElement : htmlQuery(priorElement, selector);

        if (el0) {
            const el1 = selector === "" ? newElement : htmlQuery(newElement, selector);

            if (el1) {
                state.scrollPositions.push([el1, el0.scrollTop]);
            }
        }
    }

    return state;
}

function postSyncElement(newElement: HTMLElement, state: SyncElementState) {
    if (state.focus) {
        const newFocus = htmlQuery(newElement, state.focus);
        newFocus?.focus();
    }

    for (const [el, scrollTop] of state.scrollPositions) {
        el.scrollTop = scrollTop;
    }
}

type SyncElementState = { focus?: string; scrollPositions: [HTMLElement, number][] };

type RenderTemplateData = Record<string, any> & {
    i18n?: string | TemplateLocalize;
    isSF2e?: boolean;
    systemId?: "pf2e" | "sf2e";
    systemPartial?: (path: string) => string;
};

type TemplateLocalize = ReturnType<typeof templateLocalize>;

type TemplateToolipOptions = LocalizeData & { localize?: boolean };

export { imagePath, preSyncElement, render, postSyncElement, templateLocalize, templatePath, templateTooltip };
export type { RenderTemplateData, SyncElementState, TemplateLocalize };
