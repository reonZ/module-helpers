import { MODULE } from ".";
function flagPath(...path) {
    return `flags.${MODULE.path(path)}`;
}
function getFlag(doc, ...path) {
    return doc.getFlag(MODULE.id, path.join("."));
}
function setFlag(doc, ...args) {
    const value = args.pop();
    return doc.setFlag(MODULE.id, args.join("."), value);
}
function setFlagProperty(obj, ...args) {
    const value = args.pop();
    foundry.utils.setProperty(obj, flagPath(...args), value);
    return obj;
}
function setFlagProperties(obj, ...args) {
    const properties = args.pop();
    foundry.utils.setProperty(obj, flagPath(...args), properties);
    return obj;
}
export { getFlag, setFlag, setFlagProperties, setFlagProperty };
