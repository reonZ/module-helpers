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
            const parent = operation.parent;
            const collection = parent?.getEmbeddedCollection(this.collectionName);
            for (const source of R.isArray(data) ? data : [data]) {
                const document = this.fromSource(source, { parent });
                documents.push(document);
                collection?.set(document.id, document, { modifySource: true });
            }
            if (collection && operation.broadcast === true) {
                parent?._dispatchDescendantDocumentEvents("onCreate", collection.name, [
                    documents,
                    data,
                    operation,
                ]);
            }
            return documents;
        }
        static async updateDocuments(updates = [], operation = {}) {
            const documents = [];
            const changes = [];
            const parent = operation.parent;
            const collection = parent?.getEmbeddedCollection(this.collectionName);
            if (!collection) {
                return documents;
            }
            for (const update of updates) {
                if (!R.isString(update._id))
                    continue;
                const document = collection.get(update._id, { strict: false });
                if (!document)
                    continue;
                const changed = document.updateSource(update);
                changes.push(changed);
                documents.push(document);
            }
            if (operation.broadcast === true) {
                parent?._dispatchDescendantDocumentEvents("onUpdate", collection.name, [
                    documents,
                    changes,
                    operation,
                ]);
            }
            return documents;
        }
        static async deleteDocuments(ids = [], operation = {}) {
            const documents = [];
            const deleted = [];
            const parent = operation.parent;
            const collection = parent?.getEmbeddedCollection(this.collectionName);
            if (!collection) {
                return documents;
            }
            for (const id of ids) {
                const document = collection.get(id, { strict: false });
                if (!document)
                    continue;
                if (collection.delete(id, { modifySource: true })) {
                    deleted.push(id);
                    documents.push(document);
                }
            }
            if (operation.broadcast === true) {
                for (const document of documents) {
                    document["_onDelete"](operation, game.user.id);
                }
                parent?._dispatchDescendantDocumentEvents("onDelete", collection.name, [
                    documents,
                    deleted,
                    operation,
                ]);
            }
            return documents;
        }
        _onCreateDescendantDocuments(parent, collection, ...args) { }
        _onUpdateDescendantDocuments(parent, collection, ...args) { }
        _onDeleteDescendantDocuments(parent, collection, ...args) { }
        /**
         * client/documents/abstract/client-document.mjs
         */
        _dispatchDescendantDocumentEvents(event, collection, args, _parent) {
            _parent ||= this;
            // Dispatch the event to this Document
            const fn = this[`_${event}DescendantDocuments`];
            if (!(fn instanceof Function))
                throw new Error(`Invalid descendant document event "${event}"`);
            fn.call(this, _parent, collection, ...args);
            // Bubble the event to the parent Document
            const parent = this.parent;
            if (!parent)
                return;
            parent._dispatchDescendantDocumentEvents(event, collection, args, _parent);
        }
    };
}
export { makeModuleDocument };
