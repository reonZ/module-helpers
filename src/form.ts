import { arrayToSelectOptions, htmlQuery, I18n, I18nCreateArgs, R } from ".";
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
    const data = R.mapValues(formData.object, (value) =>
        typeof value === "string" ? value.trim() : value
    );

    return expand ? (foundry.utils.expandObject(data) as Record<string, unknown>) : data;
}

function generateFormInput<T extends FormGroupType>(
    type: T,
    i18n: I18n,
    inputConfig: CreateGroupInputConfigMap[T]
) {
    const _i18n = I18n.from(inputConfig.i18n) ?? i18n;

    switch (type) {
        case "text": {
            const configs = inputConfig as CreateTextInputConfig;
            return fields.createTextInput({
                ...configs,
                value: "value" in configs ? String(configs.value) : "",
                placeholder: configs.placeholder ?? _i18n.localizeIfExist("placeholder"),
            } satisfies FormInputConfig);
        }

        case "select": {
            const configs = inputConfig as CreateSelectInputConfig;

            return fields.createSelectInput({
                ...configs,
                options: arrayToSelectOptions(configs.options, _i18n),
            });
        }
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

type BaseCreateInputConfig<T extends { name: string }> = PartialExcept<T, "name"> & {
    i18n?: I18nCreateArgs;
};

type CreateTextInputConfig = BaseCreateInputConfig<FormInputConfig>;

type CreateSelectInputConfig = Omit<BaseCreateInputConfig<SelectInputConfig>, "options"> & {
    options: FormSelectOption[] | string[];
    i18n?: I18nCreateArgs;
};

type CreateGroupInputConfigMap = {
    text: CreateTextInputConfig;
    select: CreateSelectInputConfig;
};

type FormGroupType = "text" | "select";

type BaseFormGroupParams<T extends FormGroupType> = {
    type: T;
    inputConfig: CreateGroupInputConfigMap[T];
    groupConfig?: CreateFormGroupConfig;
};

type CreateFormGroupConfig = Partial<FormGroupConfig> & {
    i18n?: I18nCreateArgs;
};

type CreateFormGroupParams = BaseFormGroupParams<"text"> | BaseFormGroupParams<"select">;

type CreateFormDataOptions = {
    expand?: boolean;
    disabled?: boolean;
    readonly?: boolean;
};

export { createFormData, createFormTemplate };
export type { CreateFormGroupParams, FormGroupType };
