import { R } from ".";
import { MODULE } from "./module";
let _DamageRoll;
let _DamageInstance;
function getDamageRollClass() {
    return (_DamageRoll ??= CONFIG.Dice.rolls.find((Roll) => Roll.name === "DamageRoll"));
}
function getDamageInstanceClass() {
    return (_DamageInstance ??= CONFIG.Dice.rolls.find((Roll) => Roll.name === "DamageInstance"));
}
function getInMemory(obj, ...path) {
    return foundry.utils.getProperty(obj, `modules.${MODULE.id}.${path.join(".")}`);
}
function setInMemory(obj, ...args) {
    const value = args.pop();
    return foundry.utils.setProperty(obj, `modules.${MODULE.id}.${args.join(".")}`, value);
}
function deleteInMemory(obj, ...path) {
    return foundry.utils.deleteProperty(obj, `modules.${MODULE.id}.${path.join(".")}`);
}
function isClientDocument(doc) {
    return doc instanceof foundry.abstract.Document && "collection" in doc;
}
function isScriptMacro(doc) {
    return doc instanceof Macro && doc.type === "script";
}
function isUuidOf(uuid, type) {
    if (!uuid) {
        return false;
    }
    const types = R.isArray(type) ? type : [type];
    const result = foundry.utils.parseUuid(uuid);
    return !!result?.type && types.includes(result.type) && !!result.documentId;
}
function isValidTargetDocuments(target) {
    return (R.isPlainObject(target) &&
        target.actor instanceof Actor &&
        (!target.token || target.token instanceof TokenDocument));
}
/**
 * https://github.com/foundryvtt/pf2e/blob/89892b6fafec1456a0358de8c6d7b102e3fe2da2/src/module/actor/item-transfer.ts#L117
 */
function getPreferredName(document) {
    if ("items" in document) {
        // Use a special moniker for party actors
        if (document.isOfType("party"))
            return game.i18n.localize("PF2E.loot.PartyStash");
        // Synthetic actor: use its token name or, failing that, actor name
        if (document.token)
            return document.token.name;
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
export { deleteInMemory, getDamageInstanceClass, getDamageRollClass, getInMemory, getPreferredName, isClientDocument, isScriptMacro, isUuidOf, isValidTargetDocuments, setInMemory, };
