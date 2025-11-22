import { I18nCreateArgs, IterableSelectOptions } from ".";
declare function createFormData<E extends HTMLFormElement>(html: E, options?: CreateFormDataOptions): Record<string, unknown>;
declare function createFormData<E extends HTMLElement | HTMLFormElement>(html: E, options?: CreateFormDataOptions): Record<string, unknown> | null;
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
type CreateFormDataOptions = {
    expand?: boolean;
    disabled?: boolean;
    readonly?: boolean;
};
export { createFormData, createFormTemplate };
export type { CreateFormGroupParams, FormGroupType };
