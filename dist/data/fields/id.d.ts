import fields = foundry.data.fields;
declare class IdField<TRequired extends boolean = false, TNullable extends boolean = false, THasInitial extends boolean = true> extends fields.DocumentIdField<string, TRequired, TNullable, THasInitial> {
    static get _defaults(): fields.StringFieldOptions<string, boolean, boolean, boolean> & {
        required: boolean;
        blank: boolean;
        nullable: boolean;
        readonly: boolean;
    };
    getInitialValue(data?: object): string;
}
export { IdField };
