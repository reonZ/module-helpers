class ModuleDocumentCollection extends foundry
    .documents.abstract.DocumentCollection {
}
export { ModuleDocumentCollection };
// class ExtendedDocumentCollection<TDocument extends ExtendedCollectionDocument> extends foundry
//     .documents.abstract.DocumentCollection<TDocument> {
//     set(id: string, document: TDocument): this {
//         throw MODULE.Error(`We do not use 'Map#set' with the ${this.name} collection`);
//     }
//     add(document: TDocument): boolean {
//         const cls = this.documentClass;
//         if (!(document instanceof cls)) {
//             throw MODULE.Error(
//                 `You may only push instances of ${this.documentName} to the ${this.name} collection`
//             );
//         }
//         if (this.has(document.id)) {
//             return false;
//         }
//         document.__collection = this;
//         super.set(document.id, document);
//         return true;
//     }
//     delete(id: string): boolean {
//         const document = this.get(id);
//         if (super.delete(id)) {
//             if (document) {
//                 document.__collection = undefined;
//             }
//             return true;
//         }
//         return false;
//     }
//     updateDocuments(updates: EmbeddedDocumentUpdateData[]): DeepPartial<TDocument["_source"]>[] {
//         return R.pipe(
//             updates,
//             R.map((update) => {
//                 const document = this.get(update._id ?? "");
//                 if (!document) return;
//                 const changed = document.updateSource(update);
//                 this._source.findSplice((source) => source._id === update._id, document.toObject());
//                 return {
//                     ...changed,
//                     _id: update._id,
//                 };
//             }),
//             R.filter(R.isTruthy)
//         );
//     }
//     fullClear() {
//         this._source.length = 0;
//         super.clear();
//     }
//     _initialize() {
//         this.clear();
//         for (const source of this._source) {
//             try {
//                 const document = this.documentClass.fromSource(source, {
//                     strict: true,
//                     dropInvalidEmbedded: true,
//                 });
//                 document.__collection = this;
//                 Map.prototype.set.call(this, document.id, document);
//             } catch (err) {
//                 this.invalidDocumentIds.add(source._id);
//                 Hooks.onError(`${this.constructor.name}#_initialize`, err, {
//                     msg: `Failed to initialize ${this.documentName} [${source._id}]`,
//                     log: "error",
//                     id: source._id,
//                 });
//             }
//         }
//     }
// }
// interface ExtendedCollectionDocument extends Document {
//     __collection: ExtendedDocumentCollection<this> | undefined;
// }
// export { ExtendedDocumentCollection };
// export type { ExtendedCollectionDocument };
