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
    return doc instanceof foundry.abstract.Document;
}
function isScriptMacro(doc) {
    return doc instanceof Macro && doc.type === "script";
}
export { deleteInMemory, getDamageInstanceClass, getDamageRollClass, getInMemory, isClientDocument, isScriptMacro, setInMemory, };
