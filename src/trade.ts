import { ActionCost, ActorPF2e, PhysicalItemPF2e, TraitViewData } from "foundry-pf2e";
import { ExtractSocketOptions } from ".";
import { getHighestName } from "./actor";
import { getActionGlyph } from "./pf2e";

async function giveItemToActor(
    { item, origin, target, quantity = 1, message }: TradeData,
    userId: string
) {
    quantity = Math.min(item.quantity, quantity);

    const newQuantity = item.quantity - quantity;
    const removeFromSource = newQuantity < 1;

    if (removeFromSource) {
        await item.delete();
    } else {
        await item.update({ "system.quantity": newQuantity });
    }

    const newItemSource = item.toObject();
    newItemSource.system.quantity = quantity;
    newItemSource.system.equipped.carryType = "worn";

    if ("invested" in newItemSource.system.equipped) {
        newItemSource.system.equipped.invested = item.traits.has("invested") ? false : null;
    }

    const newItem = await target.addToInventory(newItemSource);
    if (!newItem) return null;

    if (message) {
        createTradeMessage({
            ...message,
            origin,
            target,
            item: newItem,
            quantity,
            userId,
        });
    }

    return newItem;
}

async function createTradeMessage({
    item,
    message,
    origin,
    quantity,
    subtitle,
    target,
    userId,
    cost,
    imgPath,
}: {
    origin: ActorPF2e;
    target?: ActorPF2e;
    quantity: number;
    subtitle: string;
    message: string;
    userId?: string;
    cost?: string | number | null | ActionCost;
    imgPath?: string;
    item?: PhysicalItemPF2e;
}) {
    const giver = getHighestName(origin);
    const recipient = target ? getHighestName(target) : "";

    const glyph = getActionGlyph(
        cost ?? (origin.isOfType("loot") && target?.isOfType("loot") ? 2 : 1)
    );
    const action = { title: "PF2E.Actions.Interact.Title", subtitle: subtitle, glyph };

    const formatProperties = {
        giver,
        recipient,
        seller: giver,
        buyer: recipient,
        quantity,
        item: item ? await TextEditor.enrichHTML(item.link) : "",
    };

    const traits: TraitViewData[] = [
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
        imgPath: item?.img ?? imgPath,
        message: game.i18n.format(message, formatProperties).replace(/\b1 × /, ""),
    });

    return ChatMessage.create({
        author: userId ?? game.user.id,
        speaker: { alias: getHighestName(origin) },
        style: CONST.CHAT_MESSAGE_STYLES.EMOTE,
        flavor,
        content,
    });
}

type TradeData = {
    origin: ActorPF2e;
    target: ActorPF2e;
    item: PhysicalItemPF2e<ActorPF2e>;
    quantity: number | undefined;
    message?: { subtitle: string; message: string };
};

type TradePacket<
    TType extends string,
    TData extends TradeData = TradeData
> = ExtractSocketOptions<TData> & { type: TType };

export { createTradeMessage, giveItemToActor };
export type { TradeData, TradePacket };
