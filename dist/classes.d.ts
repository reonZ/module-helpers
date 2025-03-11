import { CreaturePF2e, DamageInstance, DamageRoll, SpellCollection, Statistic } from "foundry-pf2e";
declare function getDamageRollClass(): typeof DamageRoll;
declare function getDamageInstanceClass(): typeof DamageInstance;
declare function getSpellCollectionClass<TParent extends CreaturePF2e>(actor: TParent): typeof SpellCollection<TParent>;
declare function getSpellClass(): typeof import("foundry-pf2e/pf2e/module/item/spell/document.js").SpellPF2e;
declare function getStatisticClass(statistic: Statistic): typeof Statistic;
export { getDamageInstanceClass, getDamageRollClass, getSpellClass, getSpellCollectionClass, getStatisticClass, };
