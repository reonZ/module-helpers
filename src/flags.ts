import { MODULE } from ".";

function flagPath(...path: string[]) {
    return `flags.${MODULE.path(path)}`;
}

function getFlag<T>(doc: foundry.abstract.Document, ...path: string[]) {
    return doc.getFlag(MODULE.id, path.join(".")) as T | undefined;
}

function setFlagProperty<T extends object>(obj: T, ...args: [...string[], any]): T {
    const value = args.pop();
    foundry.utils.setProperty(obj, flagPath(...args), value);
    return obj;
}

function setFlagProperties<T extends object>(
    obj: T,
    ...args: [...string[], properties: Record<string, any>]
): T {
    const properties = args.pop();
    foundry.utils.setProperty(obj, flagPath(...(args as string[])), properties);
    return obj;
}

export { getFlag, setFlagProperties, setFlagProperty };
