import DataModel from "foundry-pf2e/foundry/common/abstract/data.js";
import {
    DataField,
    DataFieldOptions,
    DataFieldValidationOptions,
    MaybeSchemaProp,
} from "foundry-pf2e/foundry/common/data/fields.js";
import { DataModelValidationFailure } from "foundry-pf2e/foundry/common/data/validation-failure.js";
import fields = foundry.data.fields;
import validation = foundry.data.validation;

/**
 * modified version of
 * https://github.com/foundryvtt/pf2e/blob/e04bb9a3a75b9039512e3eaa541bbf5751fe2d6f/src/module/system/schema-data-fields.ts#L203
 * add a TModelProp generic to allow _cast into a new data
 */
class DataUnionField<
    TField extends DataField,
    TModelProp extends JSONValue = JSONValue,
    TRequired extends boolean = boolean,
    TNullable extends boolean = boolean,
    THasInitial extends boolean = boolean
> extends fields.DataField<
    TField extends DataField<infer TSourceProp> ? TSourceProp : never,
    TModelProp,
    TRequired,
    TNullable,
    THasInitial
> {
    fields: TField[];

    constructor(
        fields: TField[],
        options?: DataFieldOptions<
            TField extends DataField<infer TSourceProp> ? TSourceProp : never,
            TRequired,
            TNullable,
            THasInitial
        >
    ) {
        super(options);
        this.fields = fields;
    }

    protected override _cast(value?: unknown): unknown {
        if (typeof value === "string") value = value.trim();
        return value;
    }

    // override clean(
    //     value: unknown,
    //     options?: CleanFieldOptions | undefined,
    // ): MaybeUnionSchemaProp<TField, TRequired, TNullable, THasInitial> {
    //     if (Array.isArray(value) && this.fields.some((f) => f instanceof foundry.data.fields.ArrayField)) {
    //         const arrayField = this.fields.find((f) => f instanceof StrictArrayField);
    //         return (arrayField?.clean(value, options) ?? value) as MaybeUnionSchemaProp<
    //             TField,
    //             TRequired,
    //             TNullable,
    //             THasInitial
    //         >;
    //     }

    //     return super.clean(value, options) as MaybeUnionSchemaProp<TField, TRequired, TNullable, THasInitial>;
    // }

    protected override _validateType(
        value: unknown,
        options?: DataFieldValidationOptions | undefined
    ): boolean | void | DataModelValidationFailure {
        for (const field of this.fields) {
            const result = field.validate(value, options);
            if (result instanceof validation.DataModelValidationFailure) {
                if (field === this.fields.at(-1)) return result;
                continue;
            } else {
                return true;
            }
        }
        return false;
    }

    override initialize(
        value: unknown,
        model?: ConstructorOf<DataModel> | undefined,
        options?: object | undefined
    ): MaybeUnionSchemaProp<TModelProp, TRequired, TNullable, THasInitial> {
        const field = this.fields.find((f) => !f.validate(value));
        return field?.initialize(value, model, options) as MaybeUnionSchemaProp<
            TModelProp,
            TRequired,
            TNullable,
            THasInitial
        >;
    }
}

type MaybeUnionSchemaProp<
    TModelProp extends JSONValue,
    TRequired extends boolean,
    TNullable extends boolean,
    THasInitial extends boolean
> = MaybeSchemaProp<TModelProp, TRequired, TNullable, THasInitial>;

export { DataUnionField };
