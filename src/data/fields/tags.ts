import fields = foundry.data.fields;

class TagsField<
    TElement extends string = string,
    TRequired extends boolean = false,
    TNullable extends boolean = false,
    THasInitial extends boolean = true,
    TSourceProp extends TElement[] = TElement[],
    TModelProp extends TElement[] = TElement[]
> extends fields.ArrayField<
    fields.StringField,
    TSourceProp,
    TModelProp,
    TRequired,
    TNullable,
    THasInitial
> {
    static get _defaults() {
        return Object.assign(super._defaults, {
            required: false,
            nullable: false,
        });
    }

    constructor(
        options?: fields.ArrayFieldOptions<TSourceProp, TRequired, TNullable, THasInitial>,
        context?: fields.DataFieldContext
    ) {
        super(
            new fields.StringField({
                blank: false,
                nullable: false,
            }),
            options,
            context
        );
    }

    getInitialValue(data?: object) {
        return super.getInitialValue(data) ?? ([] as any);
    }
}

export { TagsField };
