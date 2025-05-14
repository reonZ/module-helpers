import fields = foundry.data.fields;
declare class PositionField<TRequired extends boolean = true, TNullable extends boolean = false, THasInitial extends boolean = true, TSourceProp extends SourceFromSchema<PositionSchema> = SourceFromSchema<PositionSchema>> extends fields.SchemaField<PositionSchema, TSourceProp, ModelPropsFromSchema<PositionSchema>, TRequired, TNullable, THasInitial> {
    constructor(options?: fields.DataFieldOptions<TSourceProp, TRequired, TNullable, THasInitial>, context?: fields.DataFieldContext);
}
declare class PositionModel extends foundry.abstract.DataModel<null, PositionSchema> {
    static defineSchema(): PositionSchema;
    set(point: Partial<Point>): void;
    set(x: number, y: number): void;
}
interface PositionModel extends foundry.abstract.DataModel<null, PositionSchema>, ModelPropsFromSchema<PositionSchema> {
}
type PositionSchema = {
    x: fields.NumberField<number, number, false, false, true>;
    y: fields.NumberField<number, number, false, false, true>;
};
export { PositionField, PositionModel };
