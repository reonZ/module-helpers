import {
    ActionCost,
    ActorPF2e,
    ContainerPF2e,
    PhysicalItemPF2e,
    PhysicalItemSource,
} from "foundry-pf2e";
import { getActionGlyph, getPreferredName, htmlQuery, R } from ".";

function getTradeData(item: PhysicalItemPF2e, quantity = 1): TradeData | undefined {
    const allowedQuantity = item.quantity ?? 0;
    if (allowedQuantity < 1) return;

    const isContainer = item.isOfType("backpack");
    const withContent = game.toolbelt?.getToolSetting("betterTrade", "withContent");
    const giveQuantity = isContainer && withContent ? 1 : Math.clamp(quantity, 1, allowedQuantity);

    const itemId = foundry.utils.randomID();
    const itemSource = item.toObject();

    itemSource._id = itemId;
    itemSource.system.quantity = giveQuantity;
    itemSource.system.equipped.carryType = "worn";

    const contentSources =
        withContent && isContainer ? getContainerContentSources(item, itemId) : [];

    return {
        allowedQuantity,
        contentSources,
        giveQuantity,
        isContainer,
        itemSource,
    };
}

async function updateTradedItemSource(
    item: PhysicalItemPF2e<ActorPF2e>,
    { contentSources, allowedQuantity, giveQuantity }: TradeData
) {
    const toDelete: string[] = contentSources.map((x) => x._previousId);
    const remainingQty = allowedQuantity - giveQuantity;

    if (remainingQty < 1) {
        toDelete.push(item.id);
    } else {
        await item.update({ "system.quantity": remainingQty });
    }

    if (toDelete.length) {
        await item.actor.deleteEmbeddedDocuments("Item", toDelete);
    }
}

async function giveItemToActor(
    itemOrUuid: PhysicalItemPF2e | EmbeddedItemUUID,
    targetOrUuid: ActorPF2e | ActorUUID,
    quantity = 1,
    newStack = true
): Promise<GiveItemData | undefined> {
    const target = R.isString(targetOrUuid)
        ? await fromUuid<ActorPF2e>(targetOrUuid)
        : targetOrUuid;

    if (!(target instanceof Actor)) return;

    const item = R.isString(itemOrUuid) ? await fromUuid<PhysicalItemPF2e>(itemOrUuid) : itemOrUuid;
    const owner = item?.actor;

    if (!(item instanceof Item) || !item.isOfType("physical") || owner?.uuid === target.uuid)
        return;

    const tradeData = getTradeData(item, quantity);
    if (!tradeData) return;

    const { contentSources, giveQuantity, isContainer, itemSource } = tradeData;

    if (owner) {
        await updateTradedItemSource(item as PhysicalItemPF2e<ActorPF2e>, tradeData);
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

    return { item: newItem as PhysicalItemPF2e, giveQuantity, hasContent };
}

async function createTradeMessage({
    cost,
    item,
    message,
    quantity,
    source,
    subtitle,
    target,
    userId,
}: TradeMessageOptions) {
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

    const glyph = getActionGlyph(
        cost ?? (source.isOfType("loot") && target?.isOfType("loot") ? 2 : 1)
    );

    const flavor = await foundry.applications.handlebars.renderTemplate(
        "./systems/pf2e/templates/chat/action/flavor.hbs",
        {
            action: { title: "PF2E.Actions.Interact.Title", subtitle, glyph },
            traits: [
                {
                    name: "manipulate",
                    label: CONFIG.PF2E.featTraits.manipulate,
                    description: CONFIG.PF2E.traitsDescriptions.manipulate,
                },
            ],
        }
    );

    const content = await foundry.applications.handlebars.renderTemplate(
        "./systems/pf2e/templates/chat/action/content.hbs",
        {
            imgPath: item.img,
            message: game.i18n.format(message, formattedMessageData).replace(/\b1 × /, ""),
        }
    );

    return getDocumentClass("ChatMessage").create({
        author: userId ?? game.userId,
        speaker: { alias: sourceName },
        style: CONST.CHAT_MESSAGE_STYLES.EMOTE,
        flavor,
        content,
    });
}

/** @recursive */
function getContainerContentSources(
    container: ContainerPF2e,
    containerId: string
): ContainerContentSource[] {
    return container.contents
        .map((item) => {
            const itemId = foundry.utils.randomID();
            const source = item.toObject() as ContainerContentSource;

            source._id = itemId;
            source._previousId = item.id;
            source.system.containerId = containerId;

            return item.isOfType("backpack")
                ? [source, ...getContainerContentSources(item, itemId)]
                : [source];
        })
        .flat();
}

function updateItemTransferDialog(
    html: HTMLElement,
    { button, prompt, title, noStack }: UpdateItemTransferDialogOptions
) {
    const titleElement = htmlQuery(html, ":scope > header h4");
    if (titleElement) {
        titleElement.innerText = title;
    }

    const buttonElement = htmlQuery(html, "form button");
    if (buttonElement) {
        buttonElement.innerText = button ?? title;
    }

    const questionElement = htmlQuery(html, "form > label");
    if (questionElement) {
        questionElement.innerText = prompt;
    }

    if (noStack) {
        const input = htmlQuery(html, "[name='newStack']");
        input?.previousElementSibling?.remove();
        input?.remove();
    }
}

type UpdateItemTransferDialogOptions = {
    title: string;
    button?: string;
    prompt: string;
    noStack?: boolean;
};

type TradeMessageOptions = {
    /** localization key */
    cost?: string | number | null | ActionCost;
    item: PhysicalItemPF2e;
    message: string;
    quantity?: number;
    source: ActorPF2e;
    subtitle: string;
    target?: ActorPF2e;
    userId?: string;
};

type ContainerContentSource = PhysicalItemSource & { _id: string; _previousId: string };

type ActorTransferItemArgs = [
    targetActor: ActorPF2e,
    item: PhysicalItemPF2e<ActorPF2e>,
    quantity: number,
    containerId?: string,
    newStack?: boolean,
    isPurchase?: boolean | null
];

type TradeData = {
    allowedQuantity: number;
    contentSources: ContainerContentSource[];
    giveQuantity: number;
    isContainer: boolean;
    itemSource: PhysicalItemSource;
};

type GiveItemData = {
    item: PhysicalItemPF2e;
    giveQuantity: number;
    hasContent: boolean;
};

export {
    createTradeMessage,
    getTradeData,
    giveItemToActor,
    updateItemTransferDialog,
    updateTradedItemSource,
};
export type { ActorTransferItemArgs, TradeMessageOptions };
