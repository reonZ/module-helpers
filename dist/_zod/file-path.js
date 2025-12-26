import { R, z } from "..";
function zFilePath(options) {
    const { base64 = false, categories = [], virtual = false, wildcard = false, } = R.isArray(options) ? { categories: options } : options;
    if (!categories.length || categories.some((c) => !(c in CONST.FILE_CATEGORIES))) {
        throw new Error("The categories of a zFilePath must be keys in CONST.FILE_CATEGORIES");
    }
    /**
     * copied from foundry
     * @see {@link foundry.data.fields.FilePathField#_validateType}
     */
    return z.custom((value) => {
        if (!R.isString(value))
            return false;
        // Wildcard or virtual paths
        if (virtual && value[0] === "#" && value.length > 1)
            return true;
        if (wildcard && value.includes("*"))
            return true;
        // Allowed extension or base64
        return categories.some((c) => {
            const category = CONST.FILE_CATEGORIES[c];
            if (foundry.data.validators.hasFileExtension(value, Object.keys(category)))
                return true;
            return foundry.data.validators.isBase64Data(value, Object.values(category));
        });
    }, {
        error: () => {
            let err = "does not have a valid file extension";
            if (base64)
                err += " or provide valid base64 data";
            return err;
        },
    });
}
export { zFilePath };
