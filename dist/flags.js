import { MODULE } from ".";
function getFlag(doc, ...path) {
    return doc.getFlag(MODULE.id, path.join("."));
}
export { getFlag };
