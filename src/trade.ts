import { ActorPF2e, ContainerPF2e, PhysicalItemPF2e, PhysicalItemSource } from "foundry-pf2e";
import { getItemFromUuid, R } from ".";

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

    const item = R.isString(itemOrUuid) ? await getItemFromUuid(itemOrUuid) : itemOrUuid;
    const owner = item?.actor;
    if (!item?.isOfType("physical") || owner?.uuid === target.uuid) return;

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

export { getTradeData, giveItemToActor, updateTradedItemSource };
export type { ActorTransferItemArgs };
