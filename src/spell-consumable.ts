import { ConsumableSource, ItemPF2e, SpellConsumableItemType, SpellPF2e } from "foundry-pf2e";
import { ErrorPF2e, MAGIC_TRADITIONS, R, objectHasKey, setHasElement } from ".";

const CANTRIP_DECK_UUID = "Compendium.pf2e.equipment-srd.Item.tLa4bewBhyqzi6Ow";

/**
 * slightly modified version of
 * https://github.com/reonZ/pf2e/blob/6e5481af7bb1e1b9d28d35fb3ad324511c5170d1/src/module/item/consumable/spell-consumables.ts#L21
 */
async function createConsumableFromSpell(
    spell: SpellPF2e,
    {
        type,
        heightenedLevel: rank = spell.baseRank,
        mystified = false,
        itemImg,
        itemName,
        temp,
    }: {
        type: SpellConsumableItemType;
        heightenedLevel?: number;
        mystified?: boolean;
        // added stuff
        temp?: boolean;
        itemName?: string;
        itemImg?: ImageFilePath;
    },
): Promise<ConsumableSource> {
    const data = objectHasKey(CONFIG.PF2E.spellcastingItems, type) ? CONFIG.PF2E.spellcastingItems[type] : null;
    const uuids: Record<number, string | null | undefined> = data?.compendiumUuids ?? [];
    const uuid = uuids?.[rank] ?? (type === "cantripDeck5" ? CANTRIP_DECK_UUID : null);
    const consumable = uuid ? await fromUuid<ItemPF2e>(uuid) : null;
    if (!consumable?.isOfType("consumable")) {
        throw ErrorPF2e("Failed to retrieve consumable item");
    }

    const consumableSource = { ...consumable.toObject(), _id: null }; // Clear _id

    const traits = consumableSource.system.traits;
    traits.value = R.unique([...traits.value, ...spell.system.traits.value]);
    traits.rarity = spell.rarity;
    if (traits.value.includes("magical") && traits.value.some((t) => setHasElement(MAGIC_TRADITIONS, t))) {
        traits.value.splice(traits.value.indexOf("magical"), 1);
    }
    traits.value.sort();

    const nameTemplate = type === "cantripDeck5" ? "PF2E.Item.Physical.FromSpell.CantripDeck5" : data?.nameTemplate;
    consumableSource.name =
        nameTemplate && !itemName
            ? game.i18n.format(nameTemplate, { name: spell.name, level: rank })
            : `${itemName ?? type} of ${spell.name} (Rank ${rank})`;
    const description = consumableSource.system.description.value;

    consumableSource.system.description.value = (() => {
        const paragraphElement = document.createElement("p");
        paragraphElement.append(spell.sourceId ? `@UUID[${spell.sourceId}]{${spell.name}}` : spell.description);

        const containerElement = document.createElement("div");
        const hrElement = document.createElement("hr");
        containerElement.append(paragraphElement, hrElement);
        hrElement.insertAdjacentHTML("afterend", description);

        return containerElement.innerHTML;
    })();

    // Cantrip deck casts at level 1
    if (type !== "cantripDeck5") {
        consumableSource.system.spell = foundry.utils.mergeObject(
            spell._source,
            { _id: foundry.utils.randomID(), system: { location: { value: null, heightenedLevel: rank } } },
            { inplace: false },
        );
    }

    if (mystified) {
        consumableSource.system.identification.status = "unidentified";
    }

    if (typeof itemImg === "string") {
        consumableSource.img = itemImg;
    }

    if (temp) {
        consumableSource.system.temporary = true;
    }

    return consumableSource;
}

export { createConsumableFromSpell };
