import fields = foundry.data.fields;
import abstract = foundry.abstract;
declare function makeModuleDocument<TParent extends (abstract.Document & ModuleDocument) | null, TSchema extends fields.DataSchema>(metadata: () => Partial<abstract.DocumentClassMetadata>, schema: () => TSchema): ConstructorOf<ModuleDocument<TParent, TSchema> & ModelPropsFromSchema<TSchema>>;
interface ModuleDocument<TParent extends abstract.Document | null = abstract._Document | null, TSchema extends fields.DataSchema = fields.DataSchema> extends abstract.Document<TParent, TSchema> {
    _onCreateDescendantDocuments(parent: ModuleDocument, collection: string, documents: ModuleDocument[], data: object[], options: object): void;
    _onUpdateDescendantDocuments(parent: ModuleDocument, collection: string, documents: ModuleDocument[], changes: object[], options: object): void;
    _onDeleteDescendantDocuments(parent: ModuleDocument, collection: string, documents: ModuleDocument[], ids: string[], options: object): void;
    _dispatchDescendantDocumentEvents(event: DispatchEvent, collection: string, args: any[], _parent?: ModuleDocument): void;
}
type DispatchEvent = "onCreate" | "onUpdate" | "onDelete";
export { makeModuleDocument };
export type { ModuleDocument };
