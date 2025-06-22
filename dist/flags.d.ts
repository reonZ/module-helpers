type Document = foundry.abstract.Document;
declare function getFlag<T>(doc: Document, ...path: string[]): T | undefined;
declare function setFlag<D extends Document, T>(doc: D, ...args: [...string[], T]): Promise<D>;
declare function unsetFlag<D extends Document>(doc: D, ...path: string[]): Promise<D>;
declare function updateFlag<T extends Record<string, unknown>>(doc: foundry.abstract.Document, updates: Partial<T> & Partial<Record<`-=${keyof T & string}`, null>>): Promise<foundry.abstract.Document<foundry.abstract._Document | null, foundry.data.fields.DataSchema> | undefined>;
declare function getFlagProperty<T>(obj: object, ...path: string[]): T | undefined;
declare function setFlagProperty<T extends object>(obj: T, ...args: [...string[], any]): T;
declare function deleteFlagProperty<T extends object>(obj: T, ...path: string[]): T;
declare function setFlagProperties<T extends object>(obj: T, ...args: [...string[], properties: Record<string, any>]): T;
declare function updateSourceFlag<T extends Document>(doc: T, ...args: [...string[], any]): DeepPartial<T["_source"]>;
declare function getDataFlag<T extends foundry.abstract.DataModel, D extends Document>(doc: D, Model: ConstructorOf<T>, ...sourcePath: string[]): undefined | FlagData<T, D>;
declare function getDataFlagArray<T extends foundry.abstract.DataModel, D extends Document>(doc: D, Model: ConstructorOf<T>, ...path: string[]): FlagDataArray<T, D> | undefined;
type FlagData<T, D> = T & {
    setFlag: () => Promise<D | undefined>;
};
type FlagDataArray<T, D> = T[] & {
    setFlag: () => Promise<D>;
};
export { deleteFlagProperty, getDataFlag, getDataFlagArray, getFlag, getFlagProperty, setFlag, setFlagProperties, setFlagProperty, unsetFlag, updateFlag, updateSourceFlag, };
export type { FlagData, FlagDataArray };
