import { getHighestName } from "./actor";
import { getActionGlyph } from "./pf2e";
async function giveItemToActor({ item, origin, target, quantity = 1, message }, userId) {
    quantity = Math.min(item.quantity, quantity);
    const newQuantity = item.quantity - quantity;
    const removeFromSource = newQuantity < 1;
    if (removeFromSource) {
        await item.delete();
    }
    else {
        await item.update({ "system.quantity": newQuantity });
    }
    const newItemSource = item.toObject();
    newItemSource.system.quantity = quantity;
    newItemSource.system.equipped.carryType = "worn";
    if ("invested" in newItemSource.system.equipped) {
        newItemSource.system.equipped.invested = item.traits.has("invested") ? false : null;
    }
    const newItem = await target.addToInventory(newItemSource);
    if (!newItem)
        return null;
    if (message) {
        createTradeMessage(origin, target, newItem, quantity, message.subtitle, message.message, userId);
    }
    return newItem;
}
async function createTradeMessage(origin, target, item, quantity, subtitle, message, userId) {
    const giver = getHighestName(origin);
    const recipient = getHighestName(target);
    const formatProperties = {
        giver,
        recipient,
        seller: giver,
        buyer: recipient,
        quantity,
        item: await TextEditor.enrichHTML(item.link),
    };
    return createActionMessage(origin, origin.isOfType("loot") && target.isOfType("loot") ? 2 : 1, item.img, subtitle, game.i18n.format(message, formatProperties).replace(/\b1 × /, ""), userId);
}
async function createActionMessage(origin, cost, imgPath, subtitle, message, userId) {
    const glyph = getActionGlyph(cost);
    const action = { title: "PF2E.Actions.Interact.Title", subtitle: subtitle, glyph };
    const traits = [
        {
            name: "manipulate",
            label: CONFIG.PF2E.featTraits.manipulate,
            description: CONFIG.PF2E.traitsDescriptions.manipulate,
        },
    ];
    const flavor = await renderTemplate("./systems/pf2e/templates/chat/action/flavor.hbs", {
        action,
        traits,
    });
    const content = await renderTemplate("./systems/pf2e/templates/chat/action/content.hbs", {
        imgPath,
        message,
    });
    return ChatMessage.create({
        author: userId ?? game.user.id,
        speaker: { alias: getHighestName(origin) },
        style: CONST.CHAT_MESSAGE_STYLES.EMOTE,
        flavor,
        content,
    });
}
export { createActionMessage, createTradeMessage, giveItemToActor };
