import { z } from "..";
declare abstract class zDocument<TSchema extends zDocumentSource = zDocumentSource> {
    #private;
    readonly _schema: TSchema;
    readonly _source: z.core.$ZodLooseShape;
    static get defineSchema(): zDocumentSource;
    static get collections(): Record<string, typeof zDocument & any>;
    constructor(source: z.input<TSchema>);
    get invalid(): boolean;
    _initialize(): void;
    update(changes: DeepPartial<z.input<TSchema>> & {
        [k: string]: any;
    }): this;
    toObject(): z.output<TSchema>;
}
type zDocumentInstance<TSchema extends zDocumentSource> = Prettify<z.output<TSchema> & zDocument<TSchema>>;
type zDocumentSource = z.ZodObject<{
    id: z.ZodReadonly<z.ZodDefault<z.ZodString>>;
}>;
export { zDocument };
export type { zDocumentInstance, zDocumentSource };
