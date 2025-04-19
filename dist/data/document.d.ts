import fields = foundry.data.fields;
import abstract = foundry.abstract;
declare abstract class ModuleDocument<TParent extends abstract.Document | null = abstract._Document | null, TSchema extends fields.DataSchema = fields.DataSchema, TCollection extends Collection<abstract.Document> = Collection<abstract.Document>> extends abstract.Document<TParent, TSchema> {
    #private;
    static defineSchema(): {};
    get collection(): TCollection | null;
    setCollection(collection: Maybe<TCollection>): void;
}
export { ModuleDocument };
