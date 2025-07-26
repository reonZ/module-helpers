import fields = foundry.data.fields;
declare class TagsField<TElement extends string = string, TRequired extends boolean = false, TNullable extends boolean = false, THasInitial extends boolean = true, TSourceProp extends TElement[] = TElement[], TModelProp extends TElement[] = TElement[]> extends fields.ArrayField<fields.StringField, TSourceProp, TModelProp, TRequired, TNullable, THasInitial> {
    static get _defaults(): fields.DataFieldOptions<unknown[], boolean, boolean, boolean> & {
        min?: number | undefined;
        max?: number | undefined;
    } & {
        required: boolean;
        nullable: boolean;
    };
    constructor(options?: fields.ArrayFieldOptions<TSourceProp, TRequired, TNullable, THasInitial>, context?: fields.DataFieldContext);
    getInitialValue(data?: object): any;
}
export { TagsField };
