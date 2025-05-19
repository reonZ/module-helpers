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
]);
function* actorItems(actor, type) {
    const types = R.isArray(type) && type.length
        ? type
        : typeof type === "string"
            ? [type]
            : R.keys(CONFIG.PF2E.Item.documentClasses);
    for (const type of types) {
        for (const item of actor.itemTypes[type]) {
            yield item;
        }
    }
}
function isSupressedFeat(item) {
    return item.isOfType("feat") && item.suppressed;
}
function isItemEntry(item) {
    return R.isObjectType(item) && "type" in item && item.type in CONFIG.PF2E.Item.documentClasses;
}
function itemTypeFromUuid(uuid) {
    const item = fromUuidSync(uuid);
    return isItemEntry(item) ? item.type : undefined;
}
function findItemWithSourceId(actor, uuid, type) {
    type ??= itemTypeFromUuid(uuid);
    for (const item of actorItems(actor, type)) {
        if (isSupressedFeat(item))
            continue;
        const sourceId = item.sourceId;
        if (sourceId === uuid) {
            return item;
        }
    }
    return null;
}
async function getItemFromUuid(uuid) {
    const item = await fromUuid(uuid);
    return item instanceof Item ? item : null;
}
function getItemSource(item, clearId) {
    const source = item.toObject();
    source._stats.compendiumSource ??= item.uuid;
    if (clearId) {
        // @ts-expect-error
        delete source._id;
    }
    return source;
}
async function getItemSourceFromUuid(uuid) {
    const item = await getItemFromUuid(uuid);
    return !!item ? getItemSource(item) : null;
}
function getItemSourceId(item) {
    return item.sourceId ?? item.uuid;
}
function isEmbeddedItem(item) {
    return !!item.actor;
}
function itemIsOfType(item, ...types) {
    return (typeof item.name === "string" &&
        types.some((t) => t === "physical" ? setHasElement(PHYSICAL_ITEM_TYPES, item.type) : item.type === t));
}
export { actorItems, findItemWithSourceId, getItemFromUuid, getItemSource, getItemSourceFromUuid, getItemSourceId, isEmbeddedItem, itemIsOfType, };
