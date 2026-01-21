import { ConsumableSource, SpellConsumableItemType, SpellPF2e } from "foundry-pf2e";
/**
 * slightly modified version of
 * https://github.com/reonZ/pf2e/blob/6e5481af7bb1e1b9d28d35fb3ad324511c5170d1/src/module/item/consumable/spell-consumables.ts#L21
 */
declare function createConsumableFromSpell(spell: SpellPF2e, { type, heightenedLevel: rank, mystified, itemImg, itemName, temp, }: {
    type: SpellConsumableItemType;
    heightenedLevel?: number;
    mystified?: boolean;
    temp?: boolean;
    itemName?: string;
    itemImg?: ImageFilePath;
}): Promise<ConsumableSource>;
export { createConsumableFromSpell };
