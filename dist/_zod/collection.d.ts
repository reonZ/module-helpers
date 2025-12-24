import { zDocument, zDocumentInstance, zDocumentSource } from ".";
import { z } from "..";
declare class zCollection<TParent extends zDocument = zDocument, TSchema extends zDocumentSource = zDocumentSource, TDocument extends zDocumentInstance<TSchema> = zDocumentInstance<TSchema>> extends Collection<TDocument> {
    #private;
    constructor(name: string, parent: TParent, DocumentCls: ConstructorOf<TDocument>);
    get source(): z.input<TSchema>[];
    _initialize(): void;
    add(entry: TDocument): this;
    addFromSource(source: z.input<TSchema>): TDocument | undefined;
    set(key: string, entry: TDocument): this;
    delete(key: string): boolean;
}
export { zCollection };
