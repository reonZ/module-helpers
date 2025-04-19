var fields = foundry.data.fields;
class SelectOptionField extends fields.SchemaField {
    constructor(options, context) {
        super({
            value: new fields.StringField({
                required: true,
                nullable: false,
            }),
            label: new fields.StringField({
                required: false,
                nullable: false,
            }),
        }, options, context);
    }
}
export { SelectOptionField };
