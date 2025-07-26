import fields = foundry.data.fields;
declare class LevelField<TRequired extends boolean = false, TNullable extends boolean = false, THasInitial extends boolean = true> extends fields.NumberField<number, number, TRequired, TNullable, THasInitial> {
    static get _defaults(): fields.NumberFieldOptions<number, boolean, boolean, boolean> & {
        required: boolean;
        nullable: boolean;
        interger: boolean;
        step: number;
        min: number;
    };
    getInitialValue(data?: object): number;
}
export { LevelField };
