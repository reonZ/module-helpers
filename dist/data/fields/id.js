var fields = foundry.data.fields;
class IdField extends fields.DocumentIdField {
    static get _defaults() {
        return Object.assign(super._defaults, {
            required: false,
            blank: false,
            nullable: false,
            readonly: true,
        });
    }
    getInitialValue(data) {
        return foundry.utils.randomID();
    }
}
export { IdField };
