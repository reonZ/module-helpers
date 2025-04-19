import fields = foundry.data.fields;

class IdField<
    TRequired extends boolean = false,
    TNullable extends boolean = false,
    THasInitial extends boolean = true
> extends fields.DocumentIdField<string, TRequired, TNullable, THasInitial> {
    static get _defaults() {
        return Object.assign(super._defaults, {
            required: false,
            blank: false,
            nullable: false,
            readonly: true,
        });
    }

    getInitialValue(data?: object): string {
        return foundry.utils.randomID();
    }
}

export { IdField };
