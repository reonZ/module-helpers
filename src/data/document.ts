import { R } from "..";
import fields = foundry.data.fields;
import abstract = foundry.abstract;

function makeModuleDocument<
    TParent extends abstract.Document | null,
    TSchema extends fields.DataSchema
>(
    metadata: () => Partial<abstract.DocumentClassMetadata>,
    schema: () => TSchema
): ConstructorOf<ModuleDocument<TParent, TSchema> & ModelPropsFromSchema<TSchema>> {
    return class extends abstract.Document<TParent, TSchema> {
        static metadata = Object.freeze(
            foundry.utils.mergeObject(super.metadata, metadata(), { inplace: false })
        );

        static defineSchema(): TSchema {
            return schema();
        }

        static async createDocuments<TDocument extends ModuleDocument>(
            this: ConstructorOf<TDocument> & typeof abstract.Document,
            data: (TDocument | PreCreate<TDocument["_source"]>)[] = [],
            operation: Partial<DatabaseCreateOperation<TDocument["parent"]>> = {}
        ): Promise<TDocument[]> {
            const documents: TDocument[] = [];
            const collection = operation.parent?.getEmbeddedCollection(this.collectionName);
            const parent = operation.parent;

            for (const source of R.isArray(data) ? data : [data]) {
                const document = this.fromSource(source, { parent }) as TDocument;

                documents.push(document);
                collection?.set(document.id, document as any, { modifySource: true });
            }

            return documents;
        }

        static async updateDocuments<TDocument extends abstract.Document>(
            this: ConstructorOf<TDocument> & typeof abstract.Document,
            updates: Record<string, unknown>[] = [],
            operation: Partial<DatabaseUpdateOperation<TDocument["parent"]>> = {}
        ): Promise<TDocument[]> {
            const documents: TDocument[] = [];
            const collection = operation.parent?.getEmbeddedCollection(this.collectionName);

            if (!collection) {
                return documents;
            }

            for (const update of updates) {
                if (!R.isString(update._id)) continue;

                const document = collection.get(update._id, { strict: false }) as TDocument;
                if (!document) continue;

                document.updateSource(update);
                documents.push(document);
            }

            return documents;
        }

        static async deleteDocuments<TDocument extends abstract.Document>(
            this: ConstructorOf<TDocument> & typeof abstract.Document,
            ids: string[] = [],
            operation: Partial<DatabaseDeleteOperation<TDocument["parent"]>> = {}
        ): Promise<TDocument[]> {
            const documents: TDocument[] = [];
            const collection = operation.parent?.getEmbeddedCollection(this.collectionName);

            if (!collection) {
                return documents;
            }

            for (const id of ids) {
                const document = collection.get(id, { strict: false }) as TDocument;
                if (!document) continue;

                if (collection.delete(id, { modifySource: true })) {
                    documents.push(document);
                }
            }

            return documents;
        }
    } as ConstructorOf<ModuleDocument<TParent, TSchema> & ModelPropsFromSchema<TSchema>>;
}

interface ModuleDocument<
    TParent extends abstract.Document | null = abstract._Document | null,
    TSchema extends fields.DataSchema = fields.DataSchema
> extends abstract.Document<TParent, TSchema> {}

export { makeModuleDocument };
export type { ModuleDocument };
