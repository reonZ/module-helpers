var abstract = foundry.abstract;
class ModuleDocument extends abstract.Document {
    #collection = null;
    static defineSchema() {
        return {};
    }
    get collection() {
        return this.#collection;
    }
    setCollection(collection) {
        this.#collection = collection ?? null;
    }
}
export { ModuleDocument };
