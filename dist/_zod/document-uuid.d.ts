import z from "zod";
declare function zDocumentUUID<T extends DocumentUUID>(options: {
    embedded?: boolean;
    type?: DocumentType;
} | DocumentType): z.ZodCustom<T, T>;
type DocumentType = (typeof CONST.ALL_DOCUMENT_TYPES)[number];
export { zDocumentUUID };
