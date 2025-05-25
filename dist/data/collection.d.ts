import DataModel = foundry.abstract.DataModel;
declare class DataModelCollection<T extends DataModelWithId> extends Collection<T> {
    constructor(Model: ConstructorOf<T>, entries?: (T | T["_source"])[]);
    add(entry: T): this;
}
type DataModelWithId = DataModel & {
    id: string;
};
export { DataModelCollection };
