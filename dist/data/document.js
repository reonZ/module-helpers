import { R } from "..";
var abstract = foundry.abstract;
function makeModuleDocument(metadata, schema) {
    return class extends abstract.Document {
        static metadata = Object.freeze(foundry.utils.mergeObject(super.metadata, metadata(), { inplace: false }));
        static defineSchema() {
            return schema();
        }
        static async createDocuments(data = [], operation = {}) {
            const documents = [];
            const collection = operation.parent?.getEmbeddedCollection(this.collectionName);
            const parent = operation.parent;
            for (const source of R.isArray(data) ? data : [data]) {
                const document = this.fromSource(source, { parent });
                documents.push(document);
                collection?.set(document.id, document, { modifySource: true });
            }
            return documents;
        }
        static async updateDocuments(updates = [], operation = {}) {
            const documents = [];
            const collection = operation.parent?.getEmbeddedCollection(this.collectionName);
            if (!collection) {
                return documents;
            }
            for (const update of updates) {
                if (!R.isString(update._id))
                    continue;
                const document = collection.get(update._id, { strict: false });
                if (!document)
                    continue;
                document.updateSource(update);
                documents.push(document);
            }
            return documents;
        }
        static async deleteDocuments(ids = [], operation = {}) {
            const documents = [];
            const collection = operation.parent?.getEmbeddedCollection(this.collectionName);
            if (!collection) {
                return documents;
            }
            for (const id of ids) {
                const document = collection.get(id, { strict: false });
                if (!document)
                    continue;
                if (collection.delete(id, { modifySource: true })) {
                    documents.push(document);
                }
            }
            return documents;
        }
    };
}
export { makeModuleDocument };
