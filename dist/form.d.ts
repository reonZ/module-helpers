import { I18n, I18nCreateArgs, IterableSelectOptions } from ".";
declare function arrayToSelectOptions(entries: Iterable<IterableSelectOptions>, i18n?: I18n): WithRequired<SelectOption, "label">[];
declare function createFormTemplate(i18n: I18nCreateArgs, groups: CreateFormGroupParams[]): string;
type FormGroupType = "checkbox" | "number" | "text" | "select";
type BaseCreateInputConfig<T extends {
    name: string;
}> = PartialExcept<T, "name"> & {
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
type CreateFormGroupParams = FormGroupParams<"checkbox"> | FormGroupParams<"number"> | FormGroupParams<"text"> | FormGroupParams<"select">;
export { arrayToSelectOptions, createFormTemplate };
export type { CreateFormGroupParams, FormGroupType };
