import { getActionGlyph, getPreferredName, R } from ".";
async function giveItemToActor(itemOrUuid, targetOrUuid, quantity = 1, newStack = true) {
    const withContent = game.toolbelt?.getToolSetting("trade", "withContent");
    const target = R.isString(targetOrUuid)
        ? await fromUuid(targetOrUuid)
        : targetOrUuid;
    if (!(target instanceof Actor))
        return;
    const item = R.isString(itemOrUuid) ? await fromUuid(itemOrUuid) : itemOrUuid;
    const owner = item?.actor;
    if (!(item instanceof Item) || !item.isOfType("physical") || owner?.uuid === target.uuid)
        return;
    const allowedQuantity = item.quantity ?? 0;
    if (allowedQuantity < 1)
        return;
    const isContainer = item.isOfType("backpack");
    const giveQuantity = isContainer && withContent ? 1 : Math.clamp(quantity, 1, allowedQuantity);
    const itemId = foundry.utils.randomID();
    const itemSource = item.toObject();
    itemSource._id = itemId;
    itemSource.system.quantity = giveQuantity;
    itemSource.system.equipped.carryType = "worn";
    const contentSources = withContent && isContainer ? getContainerContentSources(item, itemId) : [];
    if (owner) {
        const toDelete = contentSources.map((x) => x._previousId);
        const remainingQty = allowedQuantity - giveQuantity;
        if (remainingQty < 1) {
            toDelete.push(item.id);
        }
        else {
            await item.update({ "system.quantity": remainingQty });
        }
        if (toDelete.length) {
            await owner.deleteEmbeddedDocuments("Item", toDelete);
        }
    }
    if (!newStack && !isContainer) {
        const existingItem = target.inventory.findStackableItem(itemSource);
        if (existingItem) {
            await existingItem.update({ "system.quantity": existingItem.quantity + giveQuantity });
            return { item: existingItem, quantity: giveQuantity, withContent: false };
        }
    }
    const hasContent = contentSources.length > 0;
    const [newItem] = await target.createEmbeddedDocuments("Item", [itemSource], { keepId: true });
    if (newItem && hasContent) {
        await target.createEmbeddedDocuments("Item", contentSources, { keepId: true });
    }
    return { item: newItem, quantity: giveQuantity, withContent: hasContent };
}
async function createTradeMessage({ cost, item, message, quantity, source, subtitle, target, userId, }) {
    const sourceName = getPreferredName(source);
    const targetName = target ? getPreferredName(target) : "";
    const formattedMessageData = {
        source: sourceName,
        target: targetName,
        seller: sourceName,
        buyer: targetName,
        quantity: quantity ?? 1,
        item: await foundry.applications.ux.TextEditor.implementation.enrichHTML(item.link),
    };
    const glyph = getActionGlyph(cost ?? (source.isOfType("loot") && target?.isOfType("loot") ? 2 : 1));
    const flavor = await foundry.applications.handlebars.renderTemplate("./systems/pf2e/templates/chat/action/flavor.hbs", {
        action: { title: "PF2E.Actions.Interact.Title", subtitle, glyph },
        traits: [
            {
                name: "manipulate",
                label: CONFIG.PF2E.featTraits.manipulate,
                description: CONFIG.PF2E.traitsDescriptions.manipulate,
            },
        ],
    });
    const content = await foundry.applications.handlebars.renderTemplate("./systems/pf2e/templates/chat/action/content.hbs", {
        imgPath: item.img,
        message: game.i18n.format(message, formattedMessageData).replace(/\b1 × /, ""),
    });
    return getDocumentClass("ChatMessage").create({
        author: userId ?? game.userId,
        speaker: { alias: sourceName },
        style: CONST.CHAT_MESSAGE_STYLES.EMOTE,
        flavor,
        content,
    });
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
export { createTradeMessage, giveItemToActor };
