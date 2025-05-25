import { R } from "..";
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
    add(entry) {
        return this.set(entry.id, entry);
    }
}
export { DataModelCollection };
