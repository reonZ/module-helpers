import { MODULE } from "./module";
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
function getInMemory(obj, ...path) {
    return foundry.utils.getProperty(obj, `modules.${MODULE.id}.${path.join(".")}`);
}
function setInMemory(obj, ...args) {
    const value = args.pop();
    return foundry.utils.setProperty(obj, `modules.${MODULE.id}.${args.join(".")}`, value);
}
function getInMemoryAndSetIfNot(obj, ...args) {
    const value = args.pop();
    const current = getInMemory(obj, ...args);
    if (current != null)
        return current;
    const result = typeof value === "function" ? value() : value;
    setInMemory(obj, ...args, result);
    return result;
}
function deleteInMemory(obj, ...path) {
    const split = ["modules", MODULE.id, ...path.flatMap((x) => x.split("."))];
    const last = split.pop();
    let cursor = obj;
    for (const key of split) {
        if (typeof cursor !== "object" || !(key in cursor))
            return true;
        cursor = cursor[key];
    }
    return delete cursor[last];
}
export { deleteInMemory, getInMemory, getInMemoryAndSetIfNot, isInstanceOf, setInMemory };
