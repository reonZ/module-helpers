import { I18n, I18nCreateArgs, IterableSelectOptions, R } from ".";
import fields = foundry.applications.fields;

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

        const options = arrayToSelectOptions(configs.options, _i18n);

        return fields.createSelectInput({
            ...configs,
            options: configs.sort ? R.sortBy(options, R.prop("label")) : options,
        });
    }
}

function arrayToSelectOptions(
    entries: Iterable<IterableSelectOptions>,
    i18n?: I18n
): WithRequired<SelectOption, "label">[] {
    const newEntries: WithRequired<SelectOption, "label">[] = [];

    for (const entry of entries) {
        const newEntry = typeof entry === "string" ? { value: entry, label: entry } : entry;
        newEntries.push({
            ...newEntry,
            label:
                i18n?.localizeIfExist(newEntry.label ?? newEntry.value) ??
                game.i18n.localize(newEntry.label ?? newEntry.value),
        });
    }

    return newEntries;
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
    sort?: boolean;
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

export { arrayToSelectOptions, createFormTemplate };
export type { CreateFormGroupParams, FormGroupType };
