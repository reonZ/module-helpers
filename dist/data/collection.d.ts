import DataModel = foundry.abstract.DataModel;
declare class DataModelCollection<T extends DataModelWithId> extends Collection<T> {
    constructor(Model: ConstructorOf<T>, entries?: (T | T["_source"])[]);
}
declare class SettingCollection<T extends DataModelWithId> extends DataModelCollection<T> {
    #private;
    constructor(setting: string, Model: ConstructorOf<T>);
    save(): Promise<T["_source"][]>;
}
type DataModelWithId = DataModel & {
    id: string;
};
export { DataModelCollection, SettingCollection };
