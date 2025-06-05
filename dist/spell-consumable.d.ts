import { ConsumableSource, SpellConsumableItemType, SpellPF2e } from "foundry-pf2e";
/**
 * slightly modified version of
 * https://github.com/foundryvtt/pf2e/blob/4cbdaa37d6c33e9519561bae2c59a23e0288cbce/src/module/item/consumable/spell-consumables.ts#L68
 */
declare function createConsumableFromSpell(spell: SpellPF2e, { type, heightenedLevel, mystified, itemImg, itemName, temp, }: {
    type: SpellConsumableItemType;
    heightenedLevel?: number;
    mystified?: boolean;
    temp?: boolean;
    itemName?: string;
    itemImg?: ImageFilePath;
}): Promise<ConsumableSource>;
export { createConsumableFromSpell };
