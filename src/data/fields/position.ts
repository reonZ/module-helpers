import fields = foundry.data.fields;

class PositionField<
    TRequired extends boolean = true,
    TNullable extends boolean = false,
    THasInitial extends boolean = true,
    TSourceProp extends SourceFromSchema<PositionSchema> = SourceFromSchema<PositionSchema>
> extends fields.SchemaField<
    PositionSchema,
    TSourceProp,
    ModelPropsFromSchema<PositionSchema>,
    TRequired,
    TNullable,
    THasInitial
> {
    constructor(
        options?: fields.DataFieldOptions<TSourceProp, TRequired, TNullable, THasInitial>,
        context?: fields.DataFieldContext
    ) {
        super(
            {
                x: new fields.NumberField({
                    required: false,
                    nullable: false,
                    initial: 0,
                }),
                y: new fields.NumberField({
                    required: false,
                    nullable: false,
                    initial: 0,
                }),
            },
            options,
            context
        );
    }
}

type PositionSchema = {
    x: fields.NumberField<number, number, false, false, true>;
    y: fields.NumberField<number, number, false, false, true>;
};

export { PositionField };
