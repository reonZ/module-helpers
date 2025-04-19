import { StringField } from ".";
import fields = foundry.data.fields;
declare class SelectOptionField<TRequired extends boolean = true, TNullable extends boolean = false, THasInitial extends boolean = true, TSourceProp extends SourceFromSchema<SelectOptionSchema> = SourceFromSchema<SelectOptionSchema>> extends fields.SchemaField<SelectOptionSchema, TSourceProp, ModelPropsFromSchema<SelectOptionSchema>, TRequired, TNullable, THasInitial> {
    constructor(options?: fields.DataFieldOptions<TSourceProp, TRequired, TNullable, THasInitial>, context?: fields.DataFieldContext);
}
type SelectOptionSchema = {
    value: StringField<string, true>;
    label: StringField<string, false, false, false>;
};
export { SelectOptionField };
