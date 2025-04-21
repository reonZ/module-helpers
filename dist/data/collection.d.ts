import Document = foundry.abstract.Document;
declare class ExtendedDocumentCollection<TDocument extends ExtendedCollectionDocument> extends foundry
    .documents.abstract.DocumentCollection<TDocument> {
    set(id: string, document: TDocument): this;
    add(document: TDocument): boolean;
    delete(id: string): boolean;
    updateDocuments(updates: EmbeddedDocumentUpdateData[]): DeepPartial<TDocument["_source"]>[];
    fullClear(): void;
    _initialize(): void;
}
interface ExtendedCollectionDocument extends Document {
    __collection: ExtendedDocumentCollection<this> | undefined;
}
export { ExtendedDocumentCollection };
export type { ExtendedCollectionDocument };
