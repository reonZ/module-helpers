import { R } from "../..";
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

class PositionModel extends foundry.abstract.DataModel<null, PositionSchema> {
    static defineSchema(): PositionSchema {
        return {
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
        };
    }

    set(point: Partial<Point>): void;
    set(x: number, y: number): void;
    set(pointOrX: Partial<Point> | number, y?: number) {
        const point = R.isPlainObject(pointOrX) ? pointOrX : { x: pointOrX, y };
        this.updateSource(point);
    }
}

interface PositionModel
    extends foundry.abstract.DataModel<null, PositionSchema>,
        ModelPropsFromSchema<PositionSchema> {}

type PositionSchema = {
    x: fields.NumberField<number, number, false, false, true>;
    y: fields.NumberField<number, number, false, false, true>;
};

export { PositionField, PositionModel };
