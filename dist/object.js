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
    map(fn) {
        let index = 0;
        const transformed = [];
        for (const [key, value] of this.entries()) {
            transformed.push(fn(value, key, index, this));
            index++;
        }
        return transformed;
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
function purgeObject(obj) {
    if (R.isArray(obj)) {
        const newObj = R.pipe(obj, R.map(purgeObject), R.filter(R.isNonNullish));
        return newObj.length ? newObj : undefined;
    }
    else if (R.isObjectType(obj)) {
        const newObj = R.pipe(obj, R.mapValues(purgeObject), R.pickBy(R.isNonNullish));
        return foundry.utils.isEmpty(newObj) ? undefined : newObj;
    }
    else {
        return obj === "" ? undefined : obj;
    }
}
export { addToObjectIfNonNullish, gettersToData, isInstanceOf, MapOfArrays, objectIsIn, purgeObject, };
