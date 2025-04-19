import { ModelPropFromDataField, SourcePropFromDataField } from "foundry-pf2e/foundry/common/data/fields.js";
import fields = foundry.data.fields;
declare function createSchemaArray<TDataSchema extends fields.DataSchema, TArrayOptions extends [TRequired: boolean, TNullable: boolean, THasInitial: boolean] = [
    TRequired: false,
    TNullable: false,
    THasInitial: true
], TSourceProp extends SourceFromSchema<TDataSchema> = SourceFromSchema<TDataSchema>, TModelProp extends ModelPropsFromSchema<TDataSchema> = ModelPropsFromSchema<TDataSchema>, TElementField extends fields.SchemaField<TDataSchema, TSourceProp, TModelProp> = fields.SchemaField<TDataSchema, TSourceProp, TModelProp>>(schemaField: TDataSchema, schemaOptions?: fields.DataFieldOptions<TSourceProp, true, false, true>, arrayOptions?: fields.ArrayFieldOptions<fields.SourcePropFromDataField<TElementField>[], TArrayOptions[0], TArrayOptions[1], TArrayOptions[2]>): fields.ArrayField<TElementField, Partial<SourcePropFromDataField<TElementField>>[], ModelPropFromDataField<TElementField>[], TArrayOptions[0], TArrayOptions[1], TArrayOptions[2]>;
export { createSchemaArray };
