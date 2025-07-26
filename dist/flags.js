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
function updateFlag(doc, updates, operation) {
    return doc.update({ flags: { [MODULE.id]: updates } }, operation);
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
function getDataFlag(doc, Model, ...args) {
    const [sourcePath, options] = typeof args.at(-1) === "object"
        ? [args.slice(0, -1), args.at(-1)]
        : [args.slice(), {}];
    const flag = getFlag(doc, ...sourcePath);
    if (options.strict && !R.isPlainObject(flag))
        return;
    const source = foundry.utils.mergeObject(flag ?? {}, options.fallback ?? {}, {
        inplace: false,
        insertKeys: true,
        overwrite: false,
        recursive: true,
    });
    try {
        const model = new Model(source);
        if (!options.invalid && model.invalid)
            return;
        Object.defineProperty(model, "setFlag", {
            value: function () {
                const source = model.toJSON();
                const path = sourcePath.slice();
                if (!path.length) {
                    return doc.update({ [`flags.==${MODULE.id}`]: source });
                }
                const lastKey = path.pop();
                return doc.update({ [flagPath(...path, `==${lastKey}`)]: source });
            },
            enumerable: false,
            writable: false,
            configurable: false,
        });
        return model;
    }
    catch (error) {
        const name = Model.name;
        const joinPath = joinStr(".", ...sourcePath);
        MODULE.error(`An error occured while trying the create a '${name}' DataModel at path: '${joinPath}'`, error);
    }
}
function getDataFlagArray(doc, Model, ...path) {
    const maybeFlag = getFlag(doc, ...path);
    const flag = R.isArray(maybeFlag) ? maybeFlag?.slice() : [];
    const models = R.pipe(flag, R.map((data) => {
        try {
            return R.isPlainObject(data) ? new Model(data) : undefined;
        }
        catch (error) {
            const name = Model.name;
            const joinPath = joinStr(".", ...path);
            MODULE.error(`An error occured while trying the create a '${name}' DataModel in the array at path: '${joinPath}'`, error);
        }
    }), R.filter((model) => !!model && !model.invalid));
    Object.defineProperty(models, "setFlag", {
        value: function () {
            const serialized = models.map((x) => x.toJSON());
            return setFlag(doc, ...path, serialized);
        },
        enumerable: false,
        writable: false,
        configurable: false,
    });
    return models;
}
export { deleteFlagProperty, getDataFlag, getDataFlagArray, getFlag, getFlagProperty, setFlag, setFlagProperties, setFlagProperty, unsetFlag, updateFlag, updateSourceFlag, };
