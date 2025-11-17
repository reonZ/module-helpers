var fields = foundry.data.fields;
var validation = foundry.data.validation;
import { R } from "../..";
/**
 * https://github.com/foundryvtt/pf2e/blob/6c95c5d84b1e8f8b85df63f18017c7fba6c3abf5/src/module/system/schema-data-fields.ts#L407
 */
class KeyedRecordField extends fields.ObjectField {
    static recursive = true;
    keyField;
    valueField;
    constructor(keyField, valueField, options) {
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
    _isValidKeyFieldType(keyField) {
        if (keyField instanceof fields.StringField || keyField instanceof fields.NumberField) {
            if (keyField.options.required !== true || keyField.options.nullable === true) {
                throw new Error(`key field must be required and non-nullable`);
            }
            return true;
        }
        return false;
    }
    _validateValues(values, options) {
        const failures = new validation.DataModelValidationFailure();
        for (const [key, value] of Object.entries(values)) {
            // If this is a deletion key for a partial update, skip
            if (key.startsWith("-=") && options?.partial)
                continue;
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
    _cleanType(values, options) {
        for (const [key, value] of Object.entries(values)) {
            if (key.startsWith("-="))
                continue; // Don't attempt to clean deletion entries
            values[key] = this.valueField.clean(value, options);
        }
        return values;
    }
    _validateType(values, options) {
        if (!R.isPlainObject(values)) {
            return new validation.DataModelValidationFailure({ message: "must be an Object" });
        }
        return this._validateValues(values, options);
    }
    initialize(values, model, options) {
        if (!values)
            return values;
        const data = {};
        for (const [key, value] of Object.entries(values)) {
            data[key] = this.valueField.initialize(value, model, options);
        }
        return data;
    }
}
function createRecordFieldStringKey({ choices, } = {}) {
    return new fields.StringField({
        required: true,
        nullable: false,
        blank: false,
        choices,
    });
}
export { createRecordFieldStringKey, KeyedRecordField };
