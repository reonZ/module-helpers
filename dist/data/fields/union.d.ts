import DataModel from "foundry-pf2e/foundry/common/abstract/data.js";
import { DataField, DataFieldOptions, DataFieldValidationOptions, MaybeSchemaProp } from "foundry-pf2e/foundry/common/data/fields.js";
import { DataModelValidationFailure } from "foundry-pf2e/foundry/common/data/validation-failure.js";
import fields = foundry.data.fields;
/**
 * modified version of
 * https://github.com/foundryvtt/pf2e/blob/e04bb9a3a75b9039512e3eaa541bbf5751fe2d6f/src/module/system/schema-data-fields.ts#L203
 * add a TModelProp generic to allow _cast into a new data
 */
declare class DataUnionField<TField extends DataField, TModelProp extends JSONValue = JSONValue, TRequired extends boolean = boolean, TNullable extends boolean = boolean, THasInitial extends boolean = boolean> extends fields.DataField<TField extends DataField<infer TSourceProp> ? TSourceProp : never, TModelProp, TRequired, TNullable, THasInitial> {
    fields: TField[];
    constructor(fields: TField[], options?: DataFieldOptions<TField extends DataField<infer TSourceProp> ? TSourceProp : never, TRequired, TNullable, THasInitial>);
    protected _cast(value?: unknown): unknown;
    protected _validateType(value: unknown, options?: DataFieldValidationOptions | undefined): boolean | void | DataModelValidationFailure;
    initialize(value: unknown, model?: ConstructorOf<DataModel> | undefined, options?: object | undefined): MaybeUnionSchemaProp<TModelProp, TRequired, TNullable, THasInitial>;
}
type MaybeUnionSchemaProp<TModelProp extends JSONValue, TRequired extends boolean, TNullable extends boolean, THasInitial extends boolean> = MaybeSchemaProp<TModelProp, TRequired, TNullable, THasInitial>;
export { DataUnionField };
