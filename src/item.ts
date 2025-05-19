import {
    ActorPF2e,
    FeatPF2e,
    ItemInstances,
    ItemPF2e,
    ItemSourcePF2e,
    ItemType,
    PhysicalItemPF2e,
} from "foundry-pf2e";
import { R, setHasElement } from ".";

/**
 * https://github.com/foundryvtt/pf2e/blob/95e941aecaf1fa6082825b206b0ac02345d10538/src/module/item/physical/values.ts#L1
 */
const PHYSICAL_ITEM_TYPES = new Set([
    "armor",
    "backpack",
    "book",
    "consumable",
    "equipment",
    "shield",
    "treasure",
    "weapon",
] as const);

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

function findItemWithSourceId<TType extends ItemType, TActor extends ActorPF2e>(
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

async function getItemFromUuid(uuid: string): Promise<ItemPF2e | null> {
    const item = await fromUuid<ItemPF2e>(uuid);
    return item instanceof Item ? item : null;
}

function getItemSource<T extends ItemPF2e>(item: T, clearId?: boolean): T["_source"] {
    const source = item.toObject();

    source._stats.compendiumSource ??= item.uuid;

    if (clearId) {
        // @ts-expect-error
        delete source._id;
    }

    return source;
}

async function getItemSourceFromUuid(uuid: string): Promise<ItemSourcePF2e | null> {
    const item = await getItemFromUuid(uuid);
    return !!item ? getItemSource(item) : null;
}

function getItemSourceId(item: ItemPF2e): string {
    return item.sourceId ?? item.uuid;
}

function isEmbeddedItem<T extends ItemPF2e | ItemPF2e<ActorPF2e>>(
    item: T
): item is Exclude<T, ItemPF2e> {
    return !!item.actor;
}

/**
 * https://github.com/foundryvtt/pf2e/blob/95e941aecaf1fa6082825b206b0ac02345d10538/src/module/item/helpers.ts#L13
 */
function itemIsOfType<TParent extends ActorPF2e | null, TType extends ItemType>(
    item: ItemOrSource,
    ...types: TType[]
): item is ItemInstances<TParent>[TType] | ItemInstances<TParent>[TType]["_source"];
function itemIsOfType<TParent extends ActorPF2e | null, TType extends "physical" | ItemType>(
    item: ItemOrSource,
    ...types: TType[]
): item is TType extends "physical"
    ? PhysicalItemPF2e<TParent> | PhysicalItemPF2e<TParent>["_source"]
    : TType extends ItemType
    ? ItemInstances<TParent>[TType] | ItemInstances<TParent>[TType]["_source"]
    : never;
function itemIsOfType<TParent extends ActorPF2e | null>(
    item: ItemOrSource,
    type: "physical"
): item is PhysicalItemPF2e<TParent> | PhysicalItemPF2e["_source"];
function itemIsOfType(item: ItemOrSource, ...types: string[]): boolean {
    return (
        typeof item.name === "string" &&
        types.some((t) =>
            t === "physical" ? setHasElement(PHYSICAL_ITEM_TYPES, item.type) : item.type === t
        )
    );
}

type ItemOrSource = PreCreate<ItemSourcePF2e> | CompendiumIndexData | ItemPF2e;

export {
    actorItems,
    findItemWithSourceId,
    getItemFromUuid,
    getItemSource,
    getItemSourceFromUuid,
    getItemSourceId,
    isEmbeddedItem,
    itemIsOfType,
};
