import { ConsumableSource, SpellConsumableItemType, SpellPF2e } from "foundry-pf2e";
declare function createConsumableFromSpell(spell: SpellPF2e, { type, heightenedLevel, mystified, temp, itemName, itemImg, }: {
    type: SpellConsumableItemType;
    heightenedLevel?: number;
    mystified?: boolean;
    temp?: boolean;
    itemName?: string;
    itemImg?: ImageFilePath;
}): Promise<Omit<DeepPartial<ConsumableSource>, "type" | "name" | "_id"> & {
    _id?: Maybe<string>;
    name: string;
    type: "consumable";
}>;
export { createConsumableFromSpell };
