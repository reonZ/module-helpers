let _DamageRoll;
let _DamageInstance;
function getDamageRollClass() {
    return (_DamageRoll ??= CONFIG.Dice.rolls.find((Roll) => Roll.name === "DamageRoll"));
}
function getDamageInstanceClass() {
    return (_DamageInstance ??= CONFIG.Dice.rolls.find((Roll) => Roll.name === "DamageInstance"));
}
function getSpellCollectionClass(actor) {
    return actor.spellcasting.get("rituals").spells
        .constructor;
}
function getSpellClass() {
    return CONFIG.PF2E.Item.documentClasses.spell;
}
function getStatisticClass(statistic) {
    return statistic.constructor;
}
export { getDamageInstanceClass, getDamageRollClass, getSpellClass, getSpellCollectionClass, getStatisticClass, };
