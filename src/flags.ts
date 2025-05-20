import { MODULE } from ".";

function flagPath(...path: string[]): string {
    return `flags.${MODULE.path(path)}`;
}

function getFlag<T>(doc: foundry.abstract.Document, ...path: string[]): T | undefined {
    return doc.getFlag(MODULE.id, path.join(".")) as T | undefined;
}

function setFlag<D extends foundry.abstract.Document, T>(
    doc: D,
    ...args: [...string[], T]
): Promise<D> {
    const value = args.pop();
    return doc.setFlag(MODULE.id, args.join("."), value);
}

function unsetFlag<D extends foundry.abstract.Document>(doc: D, ...path: string[]): Promise<D> {
    return doc.unsetFlag(MODULE.id, path.join("."));
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

export { getFlag, setFlag, setFlagProperties, setFlagProperty, unsetFlag };
