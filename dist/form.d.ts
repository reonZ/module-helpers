import { I18nCreateArgs } from ".";
declare function createFormData<E extends HTMLFormElement>(html: E, options?: CreateFormDataOptions): Record<string, unknown>;
declare function createFormData<E extends HTMLElement | HTMLFormElement>(html: E, options?: CreateFormDataOptions): Record<string, unknown> | null;
declare function createFormTemplate(i18n: I18nCreateArgs, groups: CreateFormGroupParams[]): string;
type BaseCreateInputConfig<T extends {
    name: string;
}> = PartialExcept<T, "name"> & {
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
