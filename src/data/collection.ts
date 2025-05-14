import { getSetting, R, setSetting } from "..";
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

class SettingCollection<T extends DataModelWithId> extends DataModelCollection<T> {
    #setting: string;

    constructor(setting: string, Model: ConstructorOf<T>) {
        const entries = getSetting<T["_source"][]>(setting);
        super(Model, entries);

        this.#setting = setting;
    }

    save(): Promise<T["_source"][]> {
        const entries = this.map((entry) => entry.toObject());
        return setSetting(this.#setting, entries);
    }
}

type DataModelWithId = DataModel & { id: string };

export { DataModelCollection, SettingCollection };
