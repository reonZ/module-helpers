import { joinStr, MODULE, R } from ".";
type Document = foundry.abstract.Document;

function flagPath(...path: string[]): string {
    return `flags.${MODULE.path(path)}`;
}

function getFlag<T>(doc: Document, ...path: string[]): T | undefined {
    return doc.getFlag(MODULE.id, path.join(".")) as T | undefined;
}

function setFlag<D extends Document, T>(doc: D, ...args: [...string[], T]): Promise<D> {
    const value = args.pop();
    return doc.setFlag(MODULE.id, args.join("."), value);
}

function unsetFlag<D extends Document>(doc: D, ...path: string[]): Promise<D> {
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

function updateSourceFlag<T extends Document>(
    doc: T,
    ...args: [...string[], any]
): DeepPartial<T["_source"]> {
    const value = args.pop();
    return doc.updateSource({ [flagPath(...args)]: value });
}

function getDataFlag<T extends foundry.abstract.DataModel | foundry.abstract.DataModel[]>(
    doc: Document,
    Model: ConstructorOf<T extends foundry.abstract.DataModel[] ? T[number] : T>,
    ...path: string[]
): undefined | FlagDataModel<T> {
    const flag = getFlag(doc, ...path);
    if (!flag) return;

    try {
        if (R.isArray(flag)) {
            const models = R.pipe(
                flag,
                R.map((data): foundry.abstract.DataModel => new Model(data)),
                R.filter((model) => !model.invalid)
            );

            Object.defineProperty(models, "setFlag", {
                value: function () {
                    const serialized = models.map((x) => x.toJSON());
                    setFlag(doc, ...path, serialized);
                },
                enumerable: false,
                writable: false,
                configurable: false,
            });

            return models as any;
        } else if (R.isPlainObject(flag)) {
            const model = new Model(flag);
            if (model.invalid) return;

            Object.defineProperty(model, "setFlag", {
                value: function () {
                    setFlag(doc, ...path, model.toJSON());
                },
                enumerable: false,
                writable: false,
                configurable: false,
            });

            return model as any;
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

type FlagDataModel<T> = T & {
    setFlag: () => void;
};

export {
    deleteFlagProperty,
    getDataFlag,
    getFlag,
    getFlagProperty,
    setFlag,
    setFlagProperties,
    setFlagProperty,
    unsetFlag,
    updateSourceFlag,
};
