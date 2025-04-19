import { MODULE } from "../module";
class ExtendedDocumentCollection extends foundry
    .documents.abstract.DocumentCollection {
    set(id, document) {
        throw MODULE.Error(`We do not use 'Map#set' with the ${this.name} collection`);
    }
    add(document) {
        const cls = this.documentClass;
        if (!(document instanceof cls)) {
            throw MODULE.Error(`You may only push instances of ${this.documentName} to the ${this.name} collection`);
        }
        if (this.has(document.id)) {
            return false;
        }
        document.__collection = this;
        super.set(document.id, document);
        Hooks.callAll(MODULE.path(`add${this.documentName}`), document, this);
        return true;
    }
    delete(id) {
        const document = this.get(id);
        if (super.delete(id)) {
            if (document) {
                document.__collection = undefined;
            }
            Hooks.callAll(MODULE.path(`delete${this.documentName}`), document, this);
            return true;
        }
        return false;
    }
    fullClear() {
        this._source.length = 0;
        super.clear();
    }
    updateDocuments(updates) {
        for (const update of updates) {
            const document = this.get(update._id ?? "");
            if (!document)
                continue;
            const changed = document.updateSource(update);
            this._source.findSplice((source) => source._id === update._id, document.toObject());
            Hooks.callAll(MODULE.path(`update${this.documentName}`), document, changed, this);
        }
    }
    _initialize() {
        this.clear();
        for (const source of this._source) {
            try {
                const document = this.documentClass.fromSource(source, {
                    strict: true,
                    dropInvalidEmbedded: true,
                });
                document.__collection = this;
                Map.prototype.set.call(this, document.id, document);
            }
            catch (err) {
                this.invalidDocumentIds.add(source._id);
                Hooks.onError(`${this.constructor.name}#_initialize`, err, {
                    msg: `Failed to initialize ${this.documentName} [${source._id}]`,
                    log: "error",
                    id: source._id,
                });
            }
        }
    }
}
export { ExtendedDocumentCollection };
