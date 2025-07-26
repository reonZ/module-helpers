var fields = foundry.data.fields;
class LevelField extends fields.NumberField {
    static get _defaults() {
        return Object.assign(super._defaults, {
            required: false,
            nullable: false,
            interger: true,
            step: 1,
            min: 0,
        });
    }
    getInitialValue(data) {
        return super.getInitialValue(data) ?? 0;
    }
}
export { LevelField };
