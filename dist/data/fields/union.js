var fields = foundry.data.fields;
var validation = foundry.data.validation;
/**
 * modified version of
 * https://github.com/foundryvtt/pf2e/blob/e04bb9a3a75b9039512e3eaa541bbf5751fe2d6f/src/module/system/schema-data-fields.ts#L203
 * add a TModelProp generic to allow _cast into a new data
 */
class DataUnionField extends fields.DataField {
    fields;
    constructor(fields, options) {
        super(options);
        this.fields = fields;
    }
    _cast(value) {
        if (typeof value === "string")
            value = value.trim();
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
    _validateType(value, options) {
        for (const field of this.fields) {
            const result = field.validate(value, options);
            if (result instanceof validation.DataModelValidationFailure) {
                if (field === this.fields.at(-1))
                    return result;
                continue;
            }
            else {
                return true;
            }
        }
        return false;
    }
    initialize(value, model, options) {
        const field = this.fields.find((f) => !f.validate(value));
        return field?.initialize(value, model, options);
    }
}
export { DataUnionField };
