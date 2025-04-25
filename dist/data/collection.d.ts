import { ModuleDocument } from ".";
import Document = foundry.abstract.Document;
declare class ModuleDocumentCollection<TDocument extends Document & ModuleDocument> extends foundry
    .documents.abstract.DocumentCollection<TDocument> {
}
export { ModuleDocumentCollection };
