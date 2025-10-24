import { R } from ".";
class MapOfArrays extends Map {
    constructor(entries) {
        if (entries && !(Symbol.iterator in entries)) {
            super(Object.entries(entries));
        }
        else {
            super(entries);
        }
    }
    add(key, entry, create = true) {
        const entries = R.isArray(entry) ? entry : [entry];
        const arr = this.get(key, create);
        arr?.push(...entries);
    }
    get(key, create = false) {
        const exist = super.get(key);
        if (exist || !create) {
            return exist;
        }
        else {
            const arr = [];
            this.set(key, arr);
            return arr;
        }
    }
    remove(key, entry) {
        const arr = this.get(key);
        return arr?.findSplice((x) => x === entry) ?? null;
    }
    removeBy(key, fn) {
        const arr = this.get(key);
        return arr?.findSplice(fn) ?? null;
    }
    toObject() {
        return Object.fromEntries(this);
    }
    toJSON() {
        return this.toObject();
    }
}
function objectIsIn(obj, key) {
    return key in obj && R.isObjectType(obj[key]);
}
function isInstanceOf(obj, cls) {
    if (typeof obj !== "object" || obj === null)
        return false;
    let cursor = Reflect.getPrototypeOf(obj);
    while (cursor) {
        if (cursor.constructor.name === cls)
            return true;
        cursor = Reflect.getPrototypeOf(cursor);
    }
    return false;
}
function addToObjectIfNonNullish(obj, extra) {
    for (const [key, value] of R.entries(extra)) {
        if (value != null) {
            obj[key] = value;
        }
    }
    return obj;
}
// this returns all the getters of an instance object into a plain data object
function gettersToData(instance) {
    const Cls = instance.constructor;
    const keys = Object.entries(Object.getOwnPropertyDescriptors(Cls.prototype))
        .filter(([key, descriptor]) => typeof descriptor.get === "function")
        .map(([key]) => key);
    const obj = {};
    for (const key of keys) {
        obj[key] = instance[key];
    }
    return obj;
}
export { addToObjectIfNonNullish, gettersToData, isInstanceOf, MapOfArrays, objectIsIn };
