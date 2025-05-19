import { MODULE } from ".";

function getFlag<T>(doc: foundry.abstract.Document, ...path: string[]) {
    return doc.getFlag(MODULE.id, path.join(".")) as T | undefined;
}

export { getFlag };
