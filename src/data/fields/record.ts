import {
    CleanFieldOptions,
    DataFieldValidationOptions,
    MaybeSchemaProp,
    ModelPropFromDataField,
    ObjectFieldOptions,
    SourceFromDataField,
} from "foundry-pf2e/foundry/common/data/fields.js";
import fields = foundry.data.fields;
import validation = foundry.data.validation;
import { R } from "../..";

/**
 * https://github.com/foundryvtt/pf2e/blob/6c95c5d84b1e8f8b85df63f18017c7fba6c3abf5/src/module/system/schema-data-fields.ts#L407
 */
class KeyedRecordField<
    TKeyField extends
        | fields.StringField<string, string, true, false, false>
        | fields.NumberField<number, number, true, false, false>,
    TValueField extends fields.DataField,
    TRequired extends boolean = true,
    TNullable extends boolean = false,
    THasInitial extends boolean = true,
    TDense extends boolean = false
> extends fields.ObjectField<
    RecordFieldSourceProp<TKeyField, TValueField, TDense>,
    RecordFieldModelProp<TKeyField, TValueField, TDense>,
    TRequired,
    TNullable,
    THasInitial
> {
    static override recursive = true;

    keyField: TKeyField;
    valueField: TValueField;

    constructor(
        keyField: TKeyField,
        valueField: TValueField,
        options?: ObjectFieldOptions<
            RecordFieldSourceProp<TKeyField, TValueField, TDense>,
            TRequired,
            TNullable,
            THasInitial
        >
    ) {
        super(options);

        if (!this._isValidKeyFieldType(keyField)) {
            throw new Error(`key field must be a StringField or a NumberField`);
        }
        this.keyField = keyField;

        if (!(valueField instanceof fields.DataField)) {
            throw new Error(`${this.name} must have a DataField as its contained field`);
        }
        this.valueField = valueField;
    }

    protected _isValidKeyFieldType(
        keyField: unknown
    ): keyField is
        | fields.StringField<string, string, true, false, false>
        | fields.NumberField<number, number, true, false, false> {
        if (keyField instanceof fields.StringField || keyField instanceof fields.NumberField) {
            if (keyField.options.required !== true || keyField.options.nullable === true) {
                throw new Error(`key field must be required and non-nullable`);
            }
            return true;
        }
        return false;
    }

    protected _validateValues(
        values: Record<string, unknown>,
        options?: DataFieldValidationOptions
    ): validation.DataModelValidationFailure | void {
        const failures = new validation.DataModelValidationFailure();
        for (const [key, value] of Object.entries(values)) {
            // If this is a deletion key for a partial update, skip
            if (key.startsWith("-=") && options?.partial) continue;

            const keyFailure = this.keyField.validate(key, options);
            if (keyFailure) {
                failures.elements.push({ id: key, failure: keyFailure });
            }
            const valueFailure = this.valueField.validate(value, options);
            if (valueFailure) {
                failures.elements.push({ id: `${key}-value`, failure: valueFailure });
            }
        }
        if (failures.elements.length) {
            failures.unresolved = failures.elements.some((e) => e.failure.unresolved);
            return failures;
        }
    }

    protected override _cleanType(
        values: Record<string, unknown>,
        options?: CleanFieldOptions | undefined
    ): Record<string, unknown> {
        for (const [key, value] of Object.entries(values)) {
            if (key.startsWith("-=")) continue; // Don't attempt to clean deletion entries
            values[key] = this.valueField.clean(value, options);
        }
        return values;
    }

    protected override _validateType(
        values: unknown,
        options?: DataFieldValidationOptions
    ): boolean | validation.DataModelValidationFailure | void {
        if (!R.isPlainObject(values)) {
            return new validation.DataModelValidationFailure({ message: "must be an Object" });
        }
        return this._validateValues(values, options);
    }

    override initialize(
        values: object | null | undefined,
        model: ConstructorOf<foundry.abstract.DataModel>,
        options?: ObjectFieldOptions<
            RecordFieldSourceProp<TKeyField, TValueField>,
            TRequired,
            TNullable,
            THasInitial
        >
    ): MaybeSchemaProp<
        RecordFieldModelProp<TKeyField, TValueField, TDense>,
        TRequired,
        TNullable,
        THasInitial
    >;
    override initialize(
        values: object | null | undefined,
        model: ConstructorOf<foundry.abstract.DataModel>,
        options?: ObjectFieldOptions<
            RecordFieldSourceProp<TKeyField, TValueField>,
            TRequired,
            TNullable,
            THasInitial
        >
    ): Record<string, unknown> | null | undefined {
        if (!values) return values;
        const data: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(values)) {
            data[key] = this.valueField.initialize(value, model, options);
        }
        return data;
    }
}

type RecordFieldModelProp<
    TKeyField extends
        | fields.StringField<string, string, true, false, false>
        | fields.NumberField<number, number, true, false, false>,
    TValueField extends fields.DataField,
    TDense extends boolean = false
> = TDense extends true
    ? Record<ModelPropFromDataField<TKeyField>, ModelPropFromDataField<TValueField>>
    : TDense extends false
    ? Partial<Record<ModelPropFromDataField<TKeyField>, ModelPropFromDataField<TValueField>>>
    :
          | Record<ModelPropFromDataField<TKeyField>, ModelPropFromDataField<TValueField>>
          | Partial<Record<ModelPropFromDataField<TKeyField>, ModelPropFromDataField<TValueField>>>;

type RecordFieldSourceProp<
    TKeyField extends
        | fields.StringField<string, string, true, false, false>
        | fields.NumberField<number, number, true, false, false>,
    TValueField extends fields.DataField,
    /** Whether this is to be treated as a "dense" record; i.e., any valid key should return a value */
    TDense extends boolean = false
> = TDense extends true
    ? Record<SourceFromDataField<TKeyField>, SourceFromDataField<TValueField>>
    : TDense extends false
    ? Partial<Record<SourceFromDataField<TKeyField>, SourceFromDataField<TValueField>>>
    :
          | Record<SourceFromDataField<TKeyField>, SourceFromDataField<TValueField>>
          | Partial<Record<SourceFromDataField<TKeyField>, SourceFromDataField<TValueField>>>;

export { KeyedRecordField };
