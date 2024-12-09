import { MODULE } from "./module";
import * as R from "remeda";

function getFlag<T>(doc: foundry.abstract.Document, ...path: string[]) {
    return doc.getFlag(MODULE.id, path.join(".")) as T | undefined;
}

function setFlag<T>(doc: foundry.abstract.Document, ...args: [...string[], T]) {
    const value = args.pop();
    return doc.setFlag(MODULE.id, args.join("."), value);
}

function unsetFlag(doc: foundry.abstract.Document, ...path: string[]) {
    return doc.unsetFlag(MODULE.id, path.join("."));
}

function flagPath(...path: string[]) {
    return `flags.${MODULE.path(path)}`;
}

function getFlagProperty<T>(obj: object, ...path: string[]) {
    return foundry.utils.getProperty(obj, flagPath(...path)) as T | undefined;
}

function setFlagProperty<T extends object>(obj: T, ...args: [...string[], any]): T {
    const value = args.pop();
    foundry.utils.setProperty(obj, flagPath(...args), value);
    return obj;
}

function unsetFlagProperty<T extends object>(obj: T, ...path: string[]): T {
    const last = path.pop()!;
    setFlagProperty(obj, ...path, `-=${last}`, true);
    return obj;
}

function unsetModuleFlagProperty<T extends object>(obj: T) {
    foundry.utils.setProperty(obj, `flags.-=${MODULE.id}`, true);
    return obj;
}

function deleteFlagProperty<T extends object>(obj: T, ...path: string[]): T {
    const last = path.pop()!;
    const cursor = getFlagProperty<Maybe<Record<string, unknown>>>(obj, ...path);

    if (R.isObjectType(cursor)) {
        delete cursor[last];
    }

    return obj;
}

function updateFlag<T extends Record<string, unknown>>(
    doc: foundry.abstract.Document,
    updates: Partial<Record<keyof T, T[keyof T]>> & { [k: string]: any }
) {
    return doc.update({
        flags: {
            [MODULE.id]: updates,
        },
    });
}

function getModuleFlag<T extends Record<string, unknown>>(doc: foundry.abstract.Document) {
    return foundry.utils.getProperty(doc, `flags.${MODULE.id}`) as T | undefined;
}

function hasModuleFlag<T extends Record<string, unknown>>(doc: foundry.abstract.Document) {
    return getModuleFlag<T>(doc) !== undefined;
}

function unsetMofuleFlag(doc: foundry.abstract.Document) {
    return doc.update({
        [`flags.-=${MODULE.id}`]: true,
    });
}

function updateSourceFlag(doc: foundry.abstract.Document, ...args: [...string[], any]) {
    const value = args.pop();
    return doc.updateSource({
        [flagPath(...args)]: value,
    });
}

export {
    deleteFlagProperty,
    flagPath,
    getFlag,
    getFlagProperty,
    getModuleFlag,
    hasModuleFlag,
    setFlag,
    setFlagProperty,
    unsetFlag,
    updateFlag,
    updateSourceFlag,
    unsetFlagProperty,
    unsetModuleFlagProperty,
    unsetMofuleFlag,
};
