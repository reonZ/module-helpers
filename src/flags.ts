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

function updateFlag<T extends Record<string, unknown>, D extends foundry.abstract.Document>(
    doc: D,
    updates: T,
    operation?: Partial<DatabaseUpdateOperation<D>>
) {
    return doc.update({ flags: { [MODULE.id]: updates } }, operation);
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

function getDataFlag<T extends foundry.abstract.DataModel, D extends Document>(
    doc: D,
    Model: ConstructorOf<T>,
    ...args: DataFlagArgs<T>
): undefined | FlagData<T> {
    const [sourcePath, options] =
        typeof args.at(-1) === "object"
            ? ([args.slice(0, -1), args.at(-1)] as [ReadonlyArray<string>, DataFlagOptions<T>])
            : ([args.slice(), {}] as [ReadonlyArray<string>, DataFlagOptions<T>]);

    const flag = getFlag(doc, ...sourcePath);
    if (options.strict && !R.isPlainObject(flag)) return;

    const source = foundry.utils.mergeObject(flag ?? {}, options.fallback ?? {}, {
        inplace: false,
        insertKeys: true,
        overwrite: false,
        recursive: true,
    });

    try {
        const model = new Model(source);
        if (!options.invalid && model.invalid) return;

        Object.defineProperty(model, "setFlag", {
            value: function (): Promise<D | undefined> {
                const source = model.toJSON();
                const path = sourcePath.slice();

                if (!path.length) {
                    return doc.update({ [`flags.==${MODULE.id}`]: source });
                }

                const lastKey = path.pop() as string;
                return doc.update({ [flagPath(...path, `==${lastKey}`)]: source });
            },
            enumerable: false,
            writable: false,
            configurable: false,
        });

        return model as any;
    } catch (error) {
        const name = Model.name;
        const joinPath = joinStr(".", ...sourcePath);

        MODULE.error(
            `An error occured while trying the create a '${name}' DataModel at path: '${joinPath}'`,
            error
        );
    }
}

function getDataFlagArray<T extends foundry.abstract.DataModel, D extends Document>(
    doc: D,
    Model: ConstructorOf<T>,
    ...path: ReadonlyArray<string>
): FlagDataArray<T, D> {
    const maybeFlag = getFlag(doc, ...path);
    const flag = R.isArray(maybeFlag) ? maybeFlag?.slice() : [];

    const models = R.pipe(
        flag,
        R.map((data): foundry.abstract.DataModel | undefined => {
            try {
                return R.isPlainObject(data) ? new Model(data) : undefined;
            } catch (error) {
                const name = Model.name;
                const joinPath = joinStr(".", ...path);

                MODULE.error(
                    `An error occured while trying the create a '${name}' DataModel in the array at path: '${joinPath}'`,
                    error
                );
            }
        }),
        R.filter((model): model is foundry.abstract.DataModel => !!model && !model.invalid)
    );

    Object.defineProperty(models, "setFlag", {
        value: function (): Promise<D> {
            const serialized = models.map((x) => x.toJSON());
            return setFlag(doc, ...path, serialized);
        },
        enumerable: false,
        writable: false,
        configurable: false,
    });

    return models as any;
}

type FlagData<T> = T & {
    setFlag: () => Promise<any | undefined>;
};

type FlagDataArray<T, D> = T[] & {
    setFlag: () => Promise<D>;
};

type DataFlagOptions<T extends foundry.abstract.DataModel> = {
    /** will be merged to the flag data before instantiation */
    fallback?: DeepPartial<T["_source"]>;
    /** return data even if invalid */
    invalid?: boolean;
    /** only return the data if there is a flag */
    strict?: boolean;
};

type DataFlagArgs<T extends foundry.abstract.DataModel> = Readonly<
    [...string[], string | DataFlagOptions<T>] | string[]
>;

export {
    deleteFlagProperty,
    getDataFlag,
    getDataFlagArray,
    getFlag,
    getFlagProperty,
    setFlag,
    setFlagProperties,
    setFlagProperty,
    unsetFlag,
    updateFlag,
    updateSourceFlag,
};

export type { DataFlagArgs, DataFlagOptions, FlagData, FlagDataArray };
