type Document = foundry.abstract.Document;
declare function getFlag<T>(doc: Document, ...path: string[]): T | undefined;
declare function setFlag<D extends Document, T>(doc: D, ...args: [...string[], T]): Promise<D>;
declare function unsetFlag<D extends Document>(doc: D, ...path: string[]): Promise<D>;
declare function updateFlag<T extends Record<string, unknown>, D extends foundry.abstract.Document>(doc: D, updates: T, operation?: Partial<DatabaseUpdateOperation<D>>): Promise<D | undefined>;
declare function getFlagProperty<T>(obj: object, ...path: string[]): T | undefined;
declare function setFlagProperty<T extends object>(obj: T, ...args: [...string[], any]): T;
declare function deleteFlagProperty<T extends object>(obj: T, ...path: string[]): T;
declare function setFlagProperties<T extends object>(obj: T, ...args: [...string[], properties: Record<string, any>]): T;
declare function updateSourceFlag<T extends Document>(doc: T, ...args: [...string[], any]): DeepPartial<T["_source"]>;
declare function getDataFlag<T extends foundry.abstract.DataModel, D extends Document>(doc: D, Model: ConstructorOf<T>, ...args: DataFlagArgs<T>): undefined | FlagData<T>;
declare function getDataFlagArray<T extends foundry.abstract.DataModel, D extends Document>(doc: D, Model: ConstructorOf<T>, ...path: ReadonlyArray<string>): FlagDataArray<T, D> | undefined;
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
type DataFlagArgs<T extends foundry.abstract.DataModel> = Readonly<[
    ...string[],
    string | DataFlagOptions<T>
] | string[]>;
export { deleteFlagProperty, getDataFlag, getDataFlagArray, getFlag, getFlagProperty, setFlag, setFlagProperties, setFlagProperty, unsetFlag, updateFlag, updateSourceFlag, };
export type { DataFlagArgs, DataFlagOptions, FlagData, FlagDataArray };
