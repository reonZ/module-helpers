import { joinStr, MODULE, R } from ".";

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

function getFlagProperty<T>(obj: object, ...path: string[]): T | undefined {
    return foundry.utils.getProperty(obj, flagPath(...path)) as T | undefined;
}

function setFlagProperty<T extends object>(obj: T, ...args: [...string[], any]): T {
    const value = args.pop();
    foundry.utils.setProperty(obj, flagPath(...args), value);
    return obj;
}

function deleteFlagProperty<T extends object>(obj: T, ...path: string[]): T {
    foundry.utils.deleteProperty(obj, flagPath(...path));
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

function getDataFlag<T extends foundry.abstract.DataModel | foundry.abstract.DataModel[]>(
    doc: foundry.abstract.Document,
    Model: ConstructorOf<T extends foundry.abstract.DataModel[] ? T[number] : T>,
    ...path: string[]
): undefined | T {
    const flag = getFlag(doc, ...path);
    if (!flag) return;

    try {
        if (R.isArray(flag)) {
            return R.pipe(
                flag,
                R.map((data): foundry.abstract.DataModel => new Model(data)),
                R.filter((model) => !model.invalid)
            ) as T;
        } else {
            const model = new Model(flag);
            return model.invalid ? undefined : (model as T);
        }
    } catch (error) {
        const name = Model.name;
        const joinPath = joinStr(".", ...path);

        MODULE.error(
            `An error occured while trying the create a '${name}' DataModel at path: '${joinPath}'`,
            error
        );
    }
}

export {
    deleteFlagProperty,
    getDataFlag,
    getFlag,
    getFlagProperty,
    setFlag,
    setFlagProperties,
    setFlagProperty,
    unsetFlag,
};
