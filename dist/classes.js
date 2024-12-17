let _DamageRoll;
function getDamageRollClass() {
    return (_DamageRoll ??= CONFIG.Dice.rolls.find((Roll) => Roll.name === "DamageRoll"));
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
export { getDamageRollClass, getSpellClass, getSpellCollectionClass, getStatisticClass };
