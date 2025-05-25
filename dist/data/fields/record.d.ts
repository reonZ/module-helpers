import { CleanFieldOptions, DataFieldValidationOptions, MaybeSchemaProp, ModelPropFromDataField, ObjectFieldOptions, SourceFromDataField } from "foundry-pf2e/foundry/common/data/fields.js";
import fields = foundry.data.fields;
import validation = foundry.data.validation;
/**
 * https://github.com/foundryvtt/pf2e/blob/6c95c5d84b1e8f8b85df63f18017c7fba6c3abf5/src/module/system/schema-data-fields.ts#L407
 */
declare class KeyedRecordField<TKeyField extends fields.StringField<string, string, true, false, false> | fields.NumberField<number, number, true, false, false>, TValueField extends fields.DataField, TRequired extends boolean = true, TNullable extends boolean = false, THasInitial extends boolean = true, TDense extends boolean = false> extends fields.ObjectField<RecordFieldSourceProp<TKeyField, TValueField, TDense>, RecordFieldModelProp<TKeyField, TValueField, TDense>, TRequired, TNullable, THasInitial> {
    static recursive: boolean;
    keyField: TKeyField;
    valueField: TValueField;
    constructor(keyField: TKeyField, valueField: TValueField, options?: ObjectFieldOptions<RecordFieldSourceProp<TKeyField, TValueField, TDense>, TRequired, TNullable, THasInitial>);
    protected _isValidKeyFieldType(keyField: unknown): keyField is fields.StringField<string, string, true, false, false> | fields.NumberField<number, number, true, false, false>;
    protected _validateValues(values: Record<string, unknown>, options?: DataFieldValidationOptions): validation.DataModelValidationFailure | void;
    protected _cleanType(values: Record<string, unknown>, options?: CleanFieldOptions | undefined): Record<string, unknown>;
    protected _validateType(values: unknown, options?: DataFieldValidationOptions): boolean | validation.DataModelValidationFailure | void;
    initialize(values: object | null | undefined, model: ConstructorOf<foundry.abstract.DataModel>, options?: ObjectFieldOptions<RecordFieldSourceProp<TKeyField, TValueField>, TRequired, TNullable, THasInitial>): MaybeSchemaProp<RecordFieldModelProp<TKeyField, TValueField, TDense>, TRequired, TNullable, THasInitial>;
}
type RecordFieldModelProp<TKeyField extends fields.StringField<string, string, true, false, false> | fields.NumberField<number, number, true, false, false>, TValueField extends fields.DataField, TDense extends boolean = false> = TDense extends true ? Record<ModelPropFromDataField<TKeyField>, ModelPropFromDataField<TValueField>> : TDense extends false ? Partial<Record<ModelPropFromDataField<TKeyField>, ModelPropFromDataField<TValueField>>> : Record<ModelPropFromDataField<TKeyField>, ModelPropFromDataField<TValueField>> | Partial<Record<ModelPropFromDataField<TKeyField>, ModelPropFromDataField<TValueField>>>;
type RecordFieldSourceProp<TKeyField extends fields.StringField<string, string, true, false, false> | fields.NumberField<number, number, true, false, false>, TValueField extends fields.DataField, 
/** Whether this is to be treated as a "dense" record; i.e., any valid key should return a value */
TDense extends boolean = false> = TDense extends true ? Record<SourceFromDataField<TKeyField>, SourceFromDataField<TValueField>> : TDense extends false ? Partial<Record<SourceFromDataField<TKeyField>, SourceFromDataField<TValueField>>> : Record<SourceFromDataField<TKeyField>, SourceFromDataField<TValueField>> | Partial<Record<SourceFromDataField<TKeyField>, SourceFromDataField<TValueField>>>;
export { KeyedRecordField };
