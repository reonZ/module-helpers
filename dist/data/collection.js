import { getSetting, R, setSetting } from "..";
class DataModelCollection extends Collection {
    constructor(Model, entries) {
        const models = R.pipe(entries ?? [], R.map((entry) => {
            if (entry instanceof Model) {
                return [entry.id, entry];
            }
            const model = new Model(entry);
            if (model.invalid)
                return;
            return [model.id, model];
        }), R.filter(R.isTruthy));
        super(models);
    }
}
class SettingCollection extends DataModelCollection {
    #setting;
    constructor(setting, Model) {
        const entries = getSetting(setting);
        super(Model, entries);
        this.#setting = setting;
    }
    save() {
        const entries = this.map((entry) => entry.toObject());
        return setSetting(this.#setting, entries);
    }
}
export { DataModelCollection, SettingCollection };
