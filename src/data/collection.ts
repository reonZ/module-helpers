import { R } from "..";
import DataModel = foundry.abstract.DataModel;

class DataModelCollection<T extends DataModelWithId> extends Collection<T> {
    constructor(Model: ConstructorOf<T>, entries?: (T | T["_source"])[]) {
        const models = R.pipe(
            entries ?? [],
            R.map((entry) => {
                if (entry instanceof Model) {
                    return [entry.id, entry] as const;
                }

                const model = new Model(entry);
                if (model.invalid) return;

                return [model.id, model] as const;
            }),
            R.filter(R.isTruthy)
        );

        super(models);
    }

    add(entry: T): this {
        return this.set(entry.id, entry);
    }
}

type DataModelWithId = DataModel & { id: string };

export { DataModelCollection };
