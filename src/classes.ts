import { CreaturePF2e, DamageInstance, DamageRoll, SpellCollection, Statistic } from "foundry-pf2e";

let _DamageRoll: typeof DamageRoll;
let _DamageInstance: typeof DamageInstance;

function getDamageRollClass() {
    return (_DamageRoll ??= CONFIG.Dice.rolls.find(
        (Roll) => Roll.name === "DamageRoll"
    ) as typeof DamageRoll);
}

function getDamageInstanceClass(): typeof DamageInstance {
    return (_DamageInstance ??= CONFIG.Dice.rolls.find(
        (Roll) => Roll.name === "DamageInstance"
    ) as typeof DamageInstance);
}

function getSpellCollectionClass<TParent extends CreaturePF2e>(actor: TParent) {
    return actor.spellcasting.get("rituals")!.spells!
        .constructor as typeof SpellCollection<TParent>;
}

function getSpellClass() {
    return CONFIG.PF2E.Item.documentClasses.spell;
}

function getStatisticClass(statistic: Statistic) {
    return statistic.constructor as typeof Statistic;
}

export {
    getDamageInstanceClass,
    getDamageRollClass,
    getSpellClass,
    getSpellCollectionClass,
    getStatisticClass,
};
