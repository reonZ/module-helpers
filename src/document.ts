import {
    ActorPF2e,
    ChatMessagePF2e,
    CheckRoll,
    DamageInstance,
    DamageRoll,
    ItemPF2e,
    MacroPF2e,
    UserPF2e,
} from "foundry-pf2e";
import { htmlClosest, isInstanceOf, R } from ".";
import { MODULE } from "./module";

const _cached: {
    damageRoll?: typeof DamageRoll;
    damageInstance?: typeof DamageInstance;
    checkRoll?: typeof CheckRoll;
} = {};

function getDamageRollClass(): typeof DamageRoll {
    return (_cached.damageRoll ??= CONFIG.Dice.rolls.find(
        (Roll) => Roll.name === "DamageRoll"
    ) as typeof DamageRoll);
}

function getCheckRollClass(): typeof CheckRoll {
    return (_cached.checkRoll ??= CONFIG.Dice.rolls.find(
        (Roll) => Roll.name === "CheckRoll"
    ) as typeof CheckRoll);
}

function getDamageInstanceClass(): typeof DamageInstance {
    return (_cached.damageInstance ??= CONFIG.Dice.rolls.find(
        (Roll) => Roll.name === "DamageInstance"
    ) as typeof DamageInstance);
}

function getInMemory<T>(obj: ClientDocument | Token, ...path: string[]): T | undefined {
    return foundry.utils.getProperty(obj, `modules.${MODULE.id}.${path.join(".")}`);
}

function setInMemory<T>(obj: ClientDocument | Token, ...args: [...string[], T]): boolean {
    const value = args.pop();
    return foundry.utils.setProperty(obj, `modules.${MODULE.id}.${args.join(".")}`, value);
}

function getOrSetInMemory<T>(obj: ClientDocument | Token, ...args: [...string[], () => T]): T {
    const path = args.slice(0, -1) as string[];
    const exist = getInMemory<T>(obj, ...path);

    if (exist !== undefined) {
        return exist;
    }

    const fallback = args.at(-1) as () => T;
    const value = fallback();

    setInMemory(obj, ...path, value);
    return value;
}

function deleteInMemory(obj: ClientDocument | Token, ...path: string[]) {
    return foundry.utils.deleteProperty(obj, `modules.${MODULE.id}.${path.join(".")}`);
}

function isClientDocument<T>(doc: T): doc is Extract<T, ClientDocument> {
    return doc instanceof foundry.abstract.Document && "collection" in doc;
}

function isScriptMacro(doc: any): doc is MacroPF2e {
    return doc instanceof Macro && doc.type === "script";
}

function isUuidOf(
    uuid: string,
    type: DocumentType | DocumentType[] | ReadonlyArray<DocumentType>
): uuid is DocumentUUID {
    if (!uuid) {
        return false;
    }

    const types = R.isArray(type) ? type : [type];
    const result = foundry.utils.parseUuid(uuid);
    return !!result?.type && types.includes(result.type as DocumentType) && !!result.documentId;
}

/**
 * It also auto converts Token into TokenDocument directly in the provided obj
 */
function isValidTargetDocuments(target: unknown): target is TargetDocuments {
    if (!R.isPlainObject(target)) return false;
    if (!(target.actor instanceof Actor)) return false;

    target.token =
        target.token instanceof foundry.canvas.placeables.Token
            ? target.token.document
            : target.token;

    return !target.token || target.token instanceof TokenDocument;
}

/**
 * https://github.com/foundryvtt/pf2e/blob/89892b6fafec1456a0358de8c6d7b102e3fe2da2/src/module/actor/item-transfer.ts#L117
 */
function getPreferredName(document: ActorPF2e | UserPF2e) {
    if ("items" in document) {
        // Use a special moniker for party actors
        if (document.isOfType("party")) return game.i18n.localize("PF2E.loot.PartyStash");
        // Synthetic actor: use its token name or, failing that, actor name
        if (document.token) return document.token.name;

        // Linked actor: use its token prototype name
        return document.prototypeToken?.name ?? document.name;
    }
    // User with an assigned character
    if (document.character) {
        const token = canvas.tokens.placeables.find((t) => t.actor?.id === document.id);
        return token?.name ?? document.character?.name;
    }

    // User with no assigned character (should never happen)
    return document.name;
}

function isItemUUID(uuid: unknown, options: { embedded: true }): uuid is EmbeddedItemUUID;
function isItemUUID(
    uuid: unknown,
    options: { embedded: false }
): uuid is WorldItemUUID | CompendiumItemUUID;
function isItemUUID(uuid: unknown, options?: { embedded?: boolean }): uuid is ItemUUID;
function isItemUUID(uuid: unknown, options: { embedded?: boolean } = {}): uuid is ItemUUID {
    if (typeof uuid !== "string") return false;
    try {
        const parseResult = foundry.utils.parseUuid(uuid);
        const isEmbedded = !!parseResult && parseResult.embedded.length > 0;
        return (
            parseResult?.type === "Item" &&
            (options.embedded === true
                ? isEmbedded
                : options.embedded === false
                ? !isEmbedded
                : true)
        );
    } catch {
        return false;
    }
}

/**
 * https://github.com/foundryvtt/pf2e/blob/f7d7441acbf856b490a4e0c0d799809cd6e3dc5d/src/scripts/helpers.ts#L8
 */
function resolveSheetDocument(html: HTMLElement): ClientDocument | null {
    const sheet: { id?: string; document?: unknown } | null =
        ui.windows[Number(html.closest<HTMLElement>(".app.sheet")?.dataset.appid)] ?? null;
    const doc = sheet?.document;
    return doc instanceof Actor || doc instanceof Item || doc instanceof JournalEntry ? doc : null;
}

/**
 * https://github.com/foundryvtt/pf2e/blob/f7d7441acbf856b490a4e0c0d799809cd6e3dc5d/src/scripts/helpers.ts#L16
 */
function resolveActorAndItemFromHTML(html: HTMLElement): {
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
} {
    const messageId = htmlClosest(html, "[data-message-id]")?.dataset.messageId;
    const message = messageId ? game.messages.get(messageId) ?? null : null;
    const sheetDocument = resolveSheetDocument(html);
    const sheetActor = isInstanceOf(sheetDocument, "ActorPF2e") ? sheetDocument : null;
    const sheetItem = isInstanceOf(sheetDocument, "ItemPF2e") ? sheetDocument : null;

    const item = (() => {
        if (isItemUUID(html.dataset.itemUuid)) {
            const document = fromUuidSync(html.dataset.itemUuid);
            if (isInstanceOf(document, "ItemPF2e")) return document;
        }

        if (sheetItem) {
            return sheetItem;
        }

        if (sheetActor) {
            const itemId = htmlClosest(html, "[data-item-id]")?.dataset.itemId;
            const document = itemId ? sheetActor.items.get(itemId) : null;
            if (document) return document;
        }

        return message?.item ?? null;
    })();

    return {
        sheetActor,
        actor: item?.actor ?? message?.actor ?? null,
        item,
        message,
        appDocument: message ?? sheetDocument,
    };
}

type DocumentType = "Item" | "Actor" | "Macro";

export {
    deleteInMemory,
    getCheckRollClass,
    getDamageInstanceClass,
    getDamageRollClass,
    getInMemory,
    getOrSetInMemory,
    getPreferredName,
    isClientDocument,
    isScriptMacro,
    isUuidOf,
    isValidTargetDocuments,
    resolveActorAndItemFromHTML,
    setInMemory,
};
