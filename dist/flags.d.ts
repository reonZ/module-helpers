type Document = foundry.abstract.Document;
declare function getFlag<T>(doc: Document, ...path: string[]): T | undefined;
declare function setFlag<D extends Document, T>(doc: D, ...args: [...string[], T]): Promise<D>;
declare function unsetFlag<D extends Document>(doc: D, ...path: string[]): Promise<D>;
declare function getFlagProperty<T>(obj: object, ...path: string[]): T | undefined;
declare function setFlagProperty<T extends object>(obj: T, ...args: [...string[], any]): T;
declare function deleteFlagProperty<T extends object>(obj: T, ...path: string[]): T;
declare function setFlagProperties<T extends object>(obj: T, ...args: [...string[], properties: Record<string, any>]): T;
declare function updateSourceFlag<T extends Document>(doc: T, ...args: [...string[], any]): DeepPartial<T["_source"]>;
declare function getDataFlag<T extends foundry.abstract.DataModel | foundry.abstract.DataModel[]>(doc: Document, Model: ConstructorOf<T extends foundry.abstract.DataModel[] ? T[number] : T>, ...path: string[]): undefined | FlagDataModel<T>;
type FlagDataModel<T> = T & {
    setFlag: () => void;
};
export { deleteFlagProperty, getDataFlag, getFlag, getFlagProperty, setFlag, setFlagProperties, setFlagProperty, unsetFlag, updateSourceFlag, };
