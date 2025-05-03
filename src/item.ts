import { ActorPF2e, FeatPF2e, ItemInstances, ItemPF2e, ItemType } from "foundry-pf2e";
import { R } from ".";

function* actorItems<TType extends ItemType, TActor extends ActorPF2e>(
    actor: TActor,
    type?: TType | TType[]
): Generator<ItemInstances<TActor>[TType]> {
    const types =
        R.isArray(type) && type.length
            ? type
            : typeof type === "string"
            ? [type]
            : R.keys(CONFIG.PF2E.Item.documentClasses);

    for (const type of types) {
        for (const item of actor.itemTypes[type]) {
            yield item as ItemInstances<TActor>[TType];
        }
    }
}

function isSupressedFeat<TActor extends ActorPF2e | null>(
    item: ItemPF2e<TActor>
): item is FeatPF2e<TActor> {
    return item.isOfType("feat") && item.suppressed;
}

function isItemEntry(
    item: Maybe<ClientDocument | CompendiumIndexData>
): item is (CompendiumIndexData & { type: ItemType }) | ItemPF2e {
    return R.isObjectType(item) && "type" in item && item.type in CONFIG.PF2E.Item.documentClasses;
}

function itemTypeFromUuid<TType extends ItemType>(uuid: string) {
    const item = fromUuidSync(uuid);
    return isItemEntry(item) ? (item.type as TType) : undefined;
}

function getItemWithSourceId<TType extends ItemType, TActor extends ActorPF2e>(
    actor: TActor,
    uuid: string,
    type?: TType
): ItemInstances<TActor>[TType] | null {
    type ??= itemTypeFromUuid(uuid);

    for (const item of actorItems(actor, type)) {
        if (isSupressedFeat(item)) continue;

        const sourceId = item.sourceId;
        if (sourceId === uuid) {
            return item;
        }
    }

    return null;
}

export { actorItems, getItemWithSourceId };
