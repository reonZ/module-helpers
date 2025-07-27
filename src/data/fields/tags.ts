import {
    ModelPropFromDataField,
    SourcePropFromDataField,
} from "foundry-pf2e/foundry/common/data/fields.js";
import fields = foundry.data.fields;

class TagsField<
    TString extends string = string,
    TElementField extends fields.StringField = fields.StringField<TString, TString>
> extends fields.ArrayField<
    TElementField,
    SourcePropFromDataField<TElementField>[],
    ModelPropFromDataField<TElementField>[],
    false,
    false,
    true
> {
    static get _defaults() {
        return Object.assign(super._defaults, {
            required: false,
            nullable: false,
        });
    }

    constructor(
        options?: fields.ArrayFieldOptions<
            SourcePropFromDataField<TElementField>[],
            false,
            false,
            true
        >,
        context?: fields.DataFieldContext
    ) {
        super(
            new fields.StringField({
                blank: false,
                nullable: false,
            }) as TElementField,
            options,
            context
        );
    }

    getInitialValue(data?: object) {
        return super.getInitialValue(data) ?? ([] as any);
    }
}

export { TagsField };
