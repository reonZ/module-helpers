class zCollection extends Collection {
    #name;
    #parent;
    #document;
    constructor(name, parent, DocumentCls) {
        super();
        this.#name = name;
        this.#document = DocumentCls;
        this.#parent = parent;
    }
    get source() {
        return this.#parent._source[this.#name] ?? [];
    }
    _initialize() {
        this.clear();
        for (const source of this.source) {
            try {
                const entry = new this.#document(source);
                super.set(entry.id, entry);
            }
            catch (error) { }
        }
    }
    add(entry) {
        return this.set(entry.id, entry);
    }
    addFromSource(source) {
        try {
            const entry = new this.#document(source);
            this.set(entry.id, entry);
            return entry;
        }
        catch (error) { }
    }
    set(key, entry) {
        const sources = this.source;
        const entrySource = entry._source;
        if (this.has(key)) {
            sources.findSplice((entry) => entry.id === key, entrySource);
        }
        else {
            sources.push(entrySource);
        }
        return super.set(key, entry);
    }
    delete(key) {
        if (!this.has(key))
            return false;
        this.source.findSplice((entry) => entry.id === key);
        return super.delete(key);
    }
}
export { zCollection };
