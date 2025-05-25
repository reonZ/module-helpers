import { joinStr, MODULE, R } from ".";
function flagPath(...path) {
    return `flags.${MODULE.path(path)}`;
}
function getFlag(doc, ...path) {
    return doc.getFlag(MODULE.id, path.join("."));
}
function setFlag(doc, ...args) {
    const value = args.pop();
    return doc.setFlag(MODULE.id, args.join("."), value);
}
function unsetFlag(doc, ...path) {
    return doc.unsetFlag(MODULE.id, path.join("."));
}
function getFlagProperty(obj, ...path) {
    return foundry.utils.getProperty(obj, flagPath(...path));
}
function setFlagProperty(obj, ...args) {
    const value = args.pop();
    foundry.utils.setProperty(obj, flagPath(...args), value);
    return obj;
}
function deleteFlagProperty(obj, ...path) {
    foundry.utils.deleteProperty(obj, flagPath(...path));
    return obj;
}
function setFlagProperties(obj, ...args) {
    const properties = args.pop();
    foundry.utils.setProperty(obj, flagPath(...args), properties);
    return obj;
}
function updateSourceFlag(doc, ...args) {
    const value = args.pop();
    return doc.updateSource({ [flagPath(...args)]: value });
}
function getDataFlag(doc, Model, ...path) {
    const flag = getFlag(doc, ...path);
    if (!flag)
        return;
    try {
        if (R.isArray(flag)) {
            const models = R.pipe(flag, R.map((data) => new Model(data)), R.filter((model) => !model.invalid));
            Object.defineProperty(models, "setFlag", {
                value: function () {
                    const serialized = models.map((x) => x.toJSON());
                    setFlag(doc, ...path, serialized);
                },
                enumerable: false,
                writable: false,
                configurable: false,
            });
            return models;
        }
        else if (R.isPlainObject(flag)) {
            const model = new Model(flag);
            if (model.invalid)
                return;
            Object.defineProperty(model, "setFlag", {
                value: function () {
                    setFlag(doc, ...path, model.toJSON());
                },
                enumerable: false,
                writable: false,
                configurable: false,
            });
            return model;
        }
    }
    catch (error) {
        const name = Model.name;
        const joinPath = joinStr(".", ...path);
        MODULE.error(`An error occured while trying the create a '${name}' DataModel at path: '${joinPath}'`, error);
    }
}
export { deleteFlagProperty, getDataFlag, getFlag, getFlagProperty, setFlag, setFlagProperties, setFlagProperty, unsetFlag, updateSourceFlag, };
