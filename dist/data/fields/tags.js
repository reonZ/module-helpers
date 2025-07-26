var fields = foundry.data.fields;
class TagsField extends fields.ArrayField {
    static get _defaults() {
        return Object.assign(super._defaults, {
            required: false,
            nullable: false,
        });
    }
    constructor(options, context) {
        super(new fields.StringField({
            blank: false,
            nullable: false,
        }), options, context);
    }
    getInitialValue(data) {
        return super.getInitialValue(data) ?? [];
    }
}
export { TagsField };
