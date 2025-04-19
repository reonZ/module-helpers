var fields = foundry.data.fields;
class PositionField extends fields.SchemaField {
    constructor(options, context) {
        super({
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
        }, options, context);
    }
}
export { PositionField };
