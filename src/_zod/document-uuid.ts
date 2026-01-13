import z from "zod";
import { R } from "..";
import validators = foundry.data.validators;

function zDocumentUUID<T extends DocumentUUID>(
    options: { embedded?: boolean; type?: DocumentType } | DocumentType,
): z.ZodCustom<T, T> {
    const { embedded, type } = R.isObjectType(options) ? options : { embedded: undefined, type: options };

    if (type && !R.isIncludedIn(type, CONST.ALL_DOCUMENT_TYPES)) {
        throw new Error("The type of a zDocumentUUID must be keys in CONST.ALL_DOCUMENT_TYPES");
    }

    return z.custom((value): boolean => {
        const resolvedUUID = R.isString(value) ? foundry.utils.parseUuid(value) : null;

        if (!resolvedUUID) return false;
        if (type && resolvedUUID.type !== type) return false;
        if (resolvedUUID.type && !R.isIncludedIn(resolvedUUID.type, CONST.ALL_DOCUMENT_TYPES)) return false;
        if (embedded === true && !resolvedUUID.embedded.length) return false;
        if (embedded === false && resolvedUUID.embedded.length) return false;
        if (!resolvedUUID.documentId || !validators.isValidId(resolvedUUID.documentId)) return false;

        return true;
    });
}

type DocumentType = (typeof CONST.ALL_DOCUMENT_TYPES)[number];

export { zDocumentUUID };
