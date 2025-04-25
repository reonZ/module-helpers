import {
    ModelPropFromDataField,
    SourcePropFromDataField,
} from "foundry-pf2e/foundry/common/data/fields.js";
import fields = foundry.data.fields;

type ArrayField<
    TElementField extends fields.DataField,
    TRequired extends boolean = false,
    TNullable extends boolean = false,
    THasInitial extends boolean = true
> = fields.ArrayField<
    TElementField,
    SourcePropFromDataField<TElementField>[],
    ModelPropFromDataField<TElementField>[],
    TRequired,
    TNullable,
    THasInitial
>;

type RecordField<
    TElementField extends fields.DataField,
    TRequired extends boolean = true,
    TNullable extends boolean = false
> = fields.TypedObjectField<
    TElementField,
    Record<string, ModelPropFromDataField<TElementField>>,
    Record<string, ModelPropFromDataField<TElementField>>,
    TRequired,
    TNullable
>;

type SchemaField<
    TDataSchema extends fields.DataSchema = fields.DataSchema,
    TRequired extends boolean = true,
    TNullable extends boolean = false,
    THasInitial extends boolean = true
> = fields.SchemaField<
    TDataSchema,
    SourceFromSchema<TDataSchema>,
    ModelPropsFromSchema<TDataSchema>,
    TRequired,
    TNullable,
    THasInitial
>;

export type { ArrayField, RecordField, SchemaField };
