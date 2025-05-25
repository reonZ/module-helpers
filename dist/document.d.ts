import { ActorPF2e, ChatMessagePF2e, DamageInstance, DamageRoll, ItemPF2e, MacroPF2e, TokenDocumentPF2e, UserPF2e } from "foundry-pf2e";
declare function getDamageRollClass(): typeof DamageRoll;
declare function getDamageInstanceClass(): typeof DamageInstance;
declare function getInMemory<T>(obj: ClientDocument | Token, ...path: string[]): T | undefined;
declare function setInMemory<T>(obj: ClientDocument | Token, ...args: [...string[], T]): boolean;
declare function deleteInMemory(obj: ClientDocument | Token, ...path: string[]): boolean;
declare function isClientDocument<T>(doc: T): doc is Extract<T, ClientDocument>;
declare function isScriptMacro(doc: any): doc is MacroPF2e;
declare function isUuidOf(uuid: string, type: DocumentType | DocumentType[] | ReadonlyArray<DocumentType>): uuid is DocumentUUID;
declare function isValidTargetDocuments(target: Maybe<{
    actor: Maybe<ActorPF2e>;
    token?: Maybe<TokenDocumentPF2e>;
}>): target is TargetDocuments;
/**
 * https://github.com/foundryvtt/pf2e/blob/89892b6fafec1456a0358de8c6d7b102e3fe2da2/src/module/actor/item-transfer.ts#L117
 */
declare function getPreferredName(document: ActorPF2e | UserPF2e): string;
/**
 * https://github.com/foundryvtt/pf2e/blob/f7d7441acbf856b490a4e0c0d799809cd6e3dc5d/src/scripts/helpers.ts#L16
 */
declare function resolveActorAndItemFromHTML(html: HTMLElement): {
    /**
     * The containing sheet's primary document, if an actor.
     * Generally used to test if something was dragged from an actor sheet specifically.
     */
    sheetActor: ActorPF2e | null;
    actor: ActorPF2e | null;
    item: ItemPF2e | null;
    /** The message the actor and item are from */
    message: ChatMessagePF2e | null;
    /** The message, sheet document, or journal for this element. */
    appDocument: ClientDocument | null;
};
type DocumentType = "Item" | "Actor" | "Macro";
export { deleteInMemory, getDamageInstanceClass, getDamageRollClass, getInMemory, getPreferredName, isClientDocument, isScriptMacro, isUuidOf, isValidTargetDocuments, setInMemory, resolveActorAndItemFromHTML, };
