import { MODULE } from "./module";
import * as R from "remeda";
function getFlag(doc, ...path) {
    return doc.getFlag(MODULE.id, path.join("."));
}
function setFlag(doc, ...args) {
    const value = args.pop();
    return doc.setFlag(MODULE.id, args.join("."), value);
}
function unsetFlag(doc, ...path) {
    return doc.unsetFlag(MODULE.id, path.join("."));
}
function flagPath(...path) {
    return `flags.${MODULE.path(path)}`;
}
function getFlagProperty(obj, ...path) {
    return foundry.utils.getProperty(obj, flagPath(...path));
}
function setFlagProperty(obj, ...args) {
    const value = args.pop();
    foundry.utils.setProperty(obj, flagPath(...args), value);
    return obj;
}
function unsetFlagProperty(obj, ...path) {
    const last = path.pop();
    setFlagProperty(obj, ...path, `-=${last}`, true);
    return obj;
}
function unsetModuleFlagProperty(obj) {
    foundry.utils.setProperty(obj, `flags.-=${MODULE.id}`, true);
    return obj;
}
function deleteFlagProperty(obj, ...path) {
    const last = path.pop();
    const cursor = getFlagProperty(obj, ...path);
    if (R.isObjectType(cursor)) {
        delete cursor[last];
    }
    return obj;
}
function updateFlag(doc, updates) {
    return doc.update({
        flags: {
            [MODULE.id]: updates,
        },
    });
}
function getModuleFlag(doc) {
    return foundry.utils.getProperty(doc, `flags.${MODULE.id}`);
}
function hasModuleFlag(doc) {
    return getModuleFlag(doc) !== undefined;
}
function unsetMofuleFlag(doc) {
    return doc.update({
        [`flags.-=${MODULE.id}`]: true,
    });
}
function updateSourceFlag(doc, ...args) {
    const value = args.pop();
    return doc.updateSource({
        [flagPath(...args)]: value,
    });
}
export { deleteFlagProperty, flagPath, getFlag, getFlagProperty, getModuleFlag, hasModuleFlag, setFlag, setFlagProperty, unsetFlag, updateFlag, updateSourceFlag, unsetFlagProperty, unsetModuleFlagProperty, unsetMofuleFlag, };
