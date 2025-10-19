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
export { isInstanceOf, objectIsIn };
