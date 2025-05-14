import { R } from "../..";
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
class PositionModel extends foundry.abstract.DataModel {
    static defineSchema() {
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
    set(pointOrX, y) {
        const point = R.isPlainObject(pointOrX) ? pointOrX : { x: pointOrX, y };
        this.updateSource(point);
    }
}
export { PositionField, PositionModel };
