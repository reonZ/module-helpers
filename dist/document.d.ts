import { ActorPF2e, ChatMessagePF2e, CheckRoll, DamageInstance, DamageRoll, ItemPF2e, MacroPF2e, UserPF2e } from "foundry-pf2e";
declare function getDamageRollClass(): typeof DamageRoll;
declare function getCheckRollClass(): typeof CheckRoll;
declare function getDamageInstanceClass(): typeof DamageInstance;
declare function getInMemory<T>(obj: ClientDocument | Token, ...path: string[]): T | undefined;
declare function setInMemory<T>(obj: ClientDocument | Token, ...args: [...string[], T]): boolean;
declare function getOrSetInMemory<T>(obj: ClientDocument | Token, ...args: [...string[], () => T]): T;
declare function deleteInMemory(obj: ClientDocument | Token, ...path: string[]): boolean;
declare function isClientDocument<T>(doc: T): doc is Extract<T, ClientDocument>;
declare function isScriptMacro(doc: any): doc is MacroPF2e;
declare function isUuidOf(uuid: string, type: DocumentType | DocumentType[] | ReadonlyArray<DocumentType>): uuid is DocumentUUID;
/**
 * It also auto converts Token into TokenDocument directly in the provided obj
 */
declare function isValidTargetDocuments(target: unknown): target is TargetDocuments;
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
export { deleteInMemory, getCheckRollClass, getDamageInstanceClass, getDamageRollClass, getInMemory, getOrSetInMemory, getPreferredName, isClientDocument, isScriptMacro, isUuidOf, isValidTargetDocuments, resolveActorAndItemFromHTML, setInMemory, };
