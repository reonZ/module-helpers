import { zCollection, zID } from ".";
import { R } from "..";
class zDocument {
    #invalid = false;
    static get defineSchema() {
        throw new Error("'defineSchema' static getter must be defined");
    }
    static get collections() {
        return {};
    }
    constructor(source) {
        Object.defineProperty(this, "_schema", {
            value: this.constructor.defineSchema,
            configurable: false,
            enumerable: false,
            writable: false,
        });
        Object.defineProperty(this, "_source", {
            value: this.#initializeSource(source),
            configurable: false,
            enumerable: false,
            writable: false,
        });
        Object.seal(this._schema);
        // Object.seal(this._source);
        this._initialize();
    }
    get invalid() {
        return this.#invalid;
    }
    _initialize() {
        try {
            const data = this._schema.parse(this._source);
            const collections = this.constructor.collections;
            for (const [key, field] of R.entries(this._schema.shape)) {
                if (key in collections) {
                    if (!(key in this)) {
                        Object.defineProperty(this, key, {
                            value: new zCollection(key, this, collections[key]),
                            writable: false,
                        });
                    }
                    this[key]._initialize();
                }
                else if (field.type === "readonly") {
                    if (key in this)
                        continue;
                    Object.defineProperty(this, key, {
                        value: data[key],
                        writable: false,
                    });
                }
                else {
                    Object.defineProperty(this, key, {
                        get() {
                            return data[key];
                        },
                        set() { },
                        configurable: true,
                    });
                }
            }
            this.#invalid = false;
        }
        catch (error) {
            this.#invalid = true;
        }
    }
    update(changes) {
        const flattened = foundry.utils.flattenObject(changes);
        for (const [key, value] of R.entries(flattened)) {
            if (value === undefined) {
                foundry.utils.deleteProperty(this._source, key);
            }
            else if (R.isObjectType(value) && !R.isArray(value)) {
                const current = foundry.utils.getProperty(this._source, key) ?? {};
                const merged = foundry.utils.mergeObject(current, value);
                foundry.utils.setProperty(this._source, key, merged);
            }
            else {
                foundry.utils.setProperty(this._source, key, value);
            }
        }
        this._initialize();
        return this;
    }
    toObject() {
        return foundry.utils.deepClone(this._source);
    }
    #initializeSource(source) {
        source.id = zID.parse(source.id);
        for (const [key, field] of R.entries(this._schema.shape)) {
            if (!(key in source)) {
                source[key] = field.parse(undefined);
            }
        }
        return source;
    }
}
export { zDocument };
