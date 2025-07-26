import fields = foundry.data.fields;

class LevelField<
    TRequired extends boolean = false,
    TNullable extends boolean = false,
    THasInitial extends boolean = true
> extends fields.NumberField<number, number, TRequired, TNullable, THasInitial> {
    static get _defaults() {
        return Object.assign(super._defaults, {
            required: false,
            nullable: false,
            interger: true,
            step: 1,
            min: 0,
        });
    }

    getInitialValue(data?: object): number {
        return super.getInitialValue(data) ?? 0;
    }
}

export { LevelField };
