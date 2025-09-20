import { getItemFromUuid, R } from ".";
function getTradeData(item, quantity = 1) {
    const allowedQuantity = item.quantity ?? 0;
    if (allowedQuantity < 1)
        return;
    const isContainer = item.isOfType("backpack");
    const withContent = game.toolbelt?.getToolSetting("betterTrade", "withContent");
    const giveQuantity = isContainer && withContent ? 1 : Math.clamp(quantity, 1, allowedQuantity);
    const itemId = foundry.utils.randomID();
    const itemSource = item.toObject();
    itemSource._id = itemId;
    itemSource.system.quantity = giveQuantity;
    itemSource.system.equipped.carryType = "worn";
    const contentSources = withContent && isContainer ? getContainerContentSources(item, itemId) : [];
    return {
        allowedQuantity,
        contentSources,
        giveQuantity,
        isContainer,
        itemSource,
    };
}
async function updateTradedItemSource(item, { contentSources, allowedQuantity, giveQuantity }) {
    const toDelete = contentSources.map((x) => x._previousId);
    const remainingQty = allowedQuantity - giveQuantity;
    if (remainingQty < 1) {
        toDelete.push(item.id);
    }
    else {
        await item.update({ "system.quantity": remainingQty });
    }
    if (toDelete.length) {
        await item.actor.deleteEmbeddedDocuments("Item", toDelete);
    }
}
async function giveItemToActor(itemOrUuid, targetOrUuid, quantity = 1, newStack = true) {
    const target = R.isString(targetOrUuid)
        ? await fromUuid(targetOrUuid)
        : targetOrUuid;
    if (!(target instanceof Actor))
        return;
    const item = R.isString(itemOrUuid) ? await getItemFromUuid(itemOrUuid) : itemOrUuid;
    const owner = item?.actor;
    if (!item?.isOfType("physical") || owner?.uuid === target.uuid)
        return;
    const tradeData = getTradeData(item, quantity);
    if (!tradeData)
        return;
    const { contentSources, giveQuantity, isContainer, itemSource } = tradeData;
    if (owner) {
        await updateTradedItemSource(item, tradeData);
    }
    if (!newStack && !isContainer) {
        const existingItem = target.inventory.findStackableItem(itemSource);
        if (existingItem) {
            await existingItem.update({ "system.quantity": existingItem.quantity + giveQuantity });
            return { item: existingItem, giveQuantity, hasContent: false };
        }
    }
    const hasContent = contentSources.length > 0;
    const [newItem] = await target.createEmbeddedDocuments("Item", [itemSource], { keepId: true });
    if (newItem && hasContent) {
        await target.createEmbeddedDocuments("Item", contentSources, { keepId: true });
    }
    return { item: newItem, giveQuantity, hasContent };
}
/** @recursive */
function getContainerContentSources(container, containerId) {
    return container.contents
        .map((item) => {
        const itemId = foundry.utils.randomID();
        const source = item.toObject();
        source._id = itemId;
        source._previousId = item.id;
        source.system.containerId = containerId;
        return item.isOfType("backpack")
            ? [source, ...getContainerContentSources(item, itemId)]
            : [source];
    })
        .flat();
}
export { getTradeData, giveItemToActor, updateTradedItemSource };
