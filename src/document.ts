import { DamageInstance, DamageRoll, MacroPF2e } from "foundry-pf2e";
import { MODULE } from "./module";
import { R } from ".";

let _DamageRoll: typeof DamageRoll;
let _DamageInstance: typeof DamageInstance;

function getDamageRollClass(): typeof DamageRoll {
    return (_DamageRoll ??= CONFIG.Dice.rolls.find(
        (Roll) => Roll.name === "DamageRoll"
    ) as typeof DamageRoll);
}

function getDamageInstanceClass(): typeof DamageInstance {
    return (_DamageInstance ??= CONFIG.Dice.rolls.find(
        (Roll) => Roll.name === "DamageInstance"
    ) as typeof DamageInstance);
}

function getInMemory<T>(obj: ClientDocument, ...path: string[]): T | undefined {
    return foundry.utils.getProperty(obj, `modules.${MODULE.id}.${path.join(".")}`);
}

function setInMemory<T>(obj: ClientDocument, ...args: [...string[], T]): boolean {
    const value = args.pop();
    return foundry.utils.setProperty(obj, `modules.${MODULE.id}.${args.join(".")}`, value);
}

function deleteInMemory(obj: ClientDocument, ...path: string[]) {
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
    const types = R.isArray(type) ? type : [type];
    const result = foundry.utils.parseUuid(uuid);
    return !!result.type && types.includes(result.type as DocumentType) && !!result.documentId;
}

type DocumentType = "Item" | "Actor" | "Macro";

export {
    deleteInMemory,
    getDamageInstanceClass,
    getDamageRollClass,
    getInMemory,
    isClientDocument,
    isScriptMacro,
    isUuidOf,
    setInMemory,
};
