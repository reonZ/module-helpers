import { getHighestName } from "./actor";
import { ErrorPF2e, getActionGlyph } from "./pf2e";
import { hasGMOnline } from "./user";
function getActor(tokenId, actorId) {
    if (typeof tokenId === "string") {
        const token = canvas.tokens.placeables.find((t) => t.id === tokenId);
        return token?.actor ?? null;
    }
    return game.actors.get(actorId) ?? null;
}
function prepareTradeData(source, target, item, data) {
    return {
        ...data,
        source: { tokenId: source.token?.id, actorId: source.id, itemId: item.id },
        target: { tokenId: target.token?.id, actorId: target.id },
    };
}
function translateTradeData(data) {
    const sourceActor = getActor(data.source.tokenId, data.source.actorId);
    const targetActor = getActor(data.target.tokenId, data.target.actorId);
    const sourceItem = sourceActor?.inventory.find((i) => i.id === data.source.itemId);
    if (!sourceItem || !sourceActor || !targetActor) {
        throw ErrorPF2e("Failed sanity check during item transfer");
    }
    return {
        ...data,
        sourceActor,
        targetActor,
        sourceItem,
    };
}
function sendTradeRequest(source, target, item, data, socket) {
    if (!hasGMOnline()) {
        ui.notifications.error(game.i18n.format("PF2E.loot.GMSupervisionError", {
            loot: getHighestName(source),
        }));
        return;
    }
    const packet = prepareTradeData(source, target, item, data);
    socket.emit(packet);
}
async function enactTradeRequest(data) {
    if (!game.user.isGM) {
        throw ErrorPF2e("Unauthorized item transfer");
    }
    const quantity = Math.min(data.sourceItem.quantity, data.quantity);
    const { sourceItem, targetActor } = data;
    const newQuantity = sourceItem.quantity - quantity;
    const removeFromSource = newQuantity < 1;
    if (removeFromSource) {
        await sourceItem.delete();
    }
    else {
        await sourceItem.update({ "system.quantity": newQuantity });
    }
    const newItemData = sourceItem.toObject();
    newItemData.system.quantity = quantity;
    newItemData.system.equipped.carryType = "worn";
    if ("invested" in newItemData.system.equipped) {
        newItemData.system.equipped.invested = sourceItem.traits.has("invested") ? false : null;
    }
    const newItem = await targetActor.addToInventory(newItemData);
    if (!newItem)
        return null;
    return {
        ...data,
        quantity,
        newItem,
    };
}
async function createTradeMessage({ quantity, sourceActor, targetActor, newItem }, { message, subtitle }, senderId) {
    const giver = getHighestName(sourceActor);
    const recipient = getHighestName(targetActor);
    const formatProperties = {
        giver,
        recipient,
        seller: giver,
        buyer: recipient,
        quantity: quantity,
        item: await TextEditor.enrichHTML(newItem.link),
    };
    const content = await renderTemplate("./systems/pf2e/templates/chat/action/content.hbs", {
        imgPath: newItem.img,
        message: game.i18n.format(message, formatProperties).replace(/\b1 × /, ""),
    });
    const glyph = getActionGlyph(sourceActor.isOfType("loot") && targetActor.isOfType("loot") ? 2 : 1);
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
    await ChatMessage.create({
        author: senderId,
        speaker: { alias: formatProperties.giver },
        style: CONST.CHAT_MESSAGE_STYLES.EMOTE,
        flavor,
        content,
    });
}
export { createTradeMessage, enactTradeRequest, prepareTradeData, sendTradeRequest, translateTradeData, };
