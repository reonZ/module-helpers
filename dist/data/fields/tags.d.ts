import { ModelPropFromDataField, SourcePropFromDataField } from "foundry-pf2e/foundry/common/data/fields.js";
import fields = foundry.data.fields;
declare class TagsField<TString extends string = string, TElementField extends fields.StringField = fields.StringField<TString, TString>> extends fields.ArrayField<TElementField, SourcePropFromDataField<TElementField>[], ModelPropFromDataField<TElementField>[], false, false, true> {
    static get _defaults(): fields.DataFieldOptions<unknown[], boolean, boolean, boolean> & {
        min?: number | undefined;
        max?: number | undefined;
    } & {
        required: boolean;
        nullable: boolean;
    };
    constructor(options?: fields.ArrayFieldOptions<SourcePropFromDataField<TElementField>[], false, false, true>, context?: fields.DataFieldContext);
    getInitialValue(data?: object): SourcePropFromDataField<TElementField>[];
}
export { TagsField };
