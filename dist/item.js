import { R } from ".";
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
function getItemWithSourceId(actor, uuid, type) {
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
export { actorItems, getItemWithSourceId };
