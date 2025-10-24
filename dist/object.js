import { R } from ".";
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
export { addToObjectIfNonNullish, gettersToData, isInstanceOf, objectIsIn };
