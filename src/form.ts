import { arrayToSelectOptions, htmlQuery, I18n, I18nCreateArgs, IterableSelectOptions, R } from ".";
import fields = foundry.applications.fields;

function createFormData<E extends HTMLFormElement>(
    html: E,
    options?: CreateFormDataOptions
): Record<string, unknown>;
function createFormData<E extends HTMLElement | HTMLFormElement>(
    html: E,
    options?: CreateFormDataOptions
): Record<string, unknown> | null;
function createFormData(
    html: HTMLElement | HTMLFormElement,
    { expand = false, disabled, readonly }: CreateFormDataOptions = {}
): Record<string, unknown> | null {
    const form = html instanceof HTMLFormElement ? html : htmlQuery(html, "form");
    if (!form) return null;

    const formData = new foundry.applications.ux.FormDataExtended(form, { disabled, readonly });
    const data = R.mapValues(formData.object, (value) => {
        return typeof value === "string" ? value.trim() : value;
    });

    for (const element of form.elements) {
        if (!(element instanceof HTMLInputElement) || element.type !== "file") continue;

        data[element.name] = element.files?.[0];
    }

    return expand ? (foundry.utils.expandObject(data) as Record<string, unknown>) : data;
}

function generateFormInput<T extends FormGroupType>(
    type: T,
    i18n: I18n,
    inputConfig: CreateGroupInputConfigMap[T]
): HTMLInputElement | HTMLSelectElement | undefined {
    const _i18n = I18n.from(inputConfig.i18n) ?? i18n;

    if (type === "checkbox") {
        const configs = inputConfig as CreateCheckboxInputConfig;
        return fields.createCheckboxInput({
            ...configs,
        });
    } else if (type === "number") {
        const configs = inputConfig as CreateNumberInputConfig;
        return fields.createNumberInput({
            ...configs,
            value: "value" in configs ? Number(configs.value) : 0,
        } satisfies FormInputConfig);
    } else if (type === "text") {
        const configs = inputConfig as CreateTextInputConfig;
        return fields.createTextInput({
            ...configs,
            value: "value" in configs ? String(configs.value) : "",
            placeholder: configs.placeholder ?? _i18n.localizeIfExist("placeholder"),
        } satisfies FormInputConfig);
    } else if (type === "select") {
        const configs = inputConfig as CreateSelectInputConfig;

        if (configs.options.length <= 1) {
            configs.disabled = true;
        }

        return fields.createSelectInput({
            ...configs,
            options: arrayToSelectOptions(configs.options, _i18n),
        });
    }
}

function createFormGroup<T extends FormGroupType>(
    type: T,
    inputConfig: CreateGroupInputConfigMap[T],
    groupConfig: WithRequired<CreateFormGroupConfig, "i18n">
): string {
    const i18n = I18n.from(groupConfig.i18n);

    groupConfig.input = generateFormInput(type, i18n, inputConfig);
    groupConfig.hint ??= i18n.localizeIfExist("hint");
    groupConfig.label ??= i18n.localize("label");

    return fields.createFormGroup(groupConfig as FormGroupConfig).outerHTML;
}

function createFormTemplate(i18n: I18nCreateArgs, groups: CreateFormGroupParams[]): string {
    const _i18n = I18n.from(i18n);

    return R.pipe(
        groups,
        R.map(({ type, inputConfig, groupConfig }) => {
            const config: WithRequired<CreateFormGroupConfig, "i18n"> = {
                ...groupConfig,
                i18n: (I18n.from(groupConfig?.i18n) ?? _i18n).clone(inputConfig.name),
            };
            return createFormGroup(type, inputConfig, config);
        }),
        R.join("")
    );
}

type FormGroupType = "checkbox" | "number" | "text" | "select";

type BaseCreateInputConfig<T extends { name: string }> = PartialExcept<T, "name"> & {
    i18n?: I18nCreateArgs;
    disabled?: boolean;
};

type CreateCheckboxInputConfig = BaseCreateInputConfig<FormInputConfig<boolean>>;

type CreateNumberInputConfig = BaseCreateInputConfig<NumberInputConfig>;

type CreateTextInputConfig = BaseCreateInputConfig<FormInputConfig<string>>;

type CreateSelectInputConfig = Omit<BaseCreateInputConfig<SelectInputConfig>, "options"> & {
    options: IterableSelectOptions[] | ReadonlyArray<IterableSelectOptions>;
};

type CreateGroupInputConfigMap = {
    checkbox: CreateCheckboxInputConfig;
    number: CreateNumberInputConfig;
    text: CreateTextInputConfig;
    select: CreateSelectInputConfig;
};

type FormGroupParams<T extends FormGroupType> = {
    type: T;
    inputConfig: CreateGroupInputConfigMap[T];
    groupConfig?: CreateFormGroupConfig;
};

type CreateFormGroupConfig = Partial<FormGroupConfig> & {
    i18n?: I18nCreateArgs;
};

type CreateFormGroupParams =
    | FormGroupParams<"checkbox">
    | FormGroupParams<"number">
    | FormGroupParams<"text">
    | FormGroupParams<"select">;

type CreateFormDataOptions = {
    expand?: boolean;
    disabled?: boolean;
    readonly?: boolean;
};

export { createFormData, createFormTemplate };
export type { CreateFormGroupParams, FormGroupType };
