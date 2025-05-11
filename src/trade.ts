import { ActorPF2e, ContainerPF2e, ItemPF2e, PhysicalItemSource } from "foundry-pf2e";
import { R } from ".";

async function giveItemToActor(
    itemOrUuid: ItemPF2e | EmbeddedItemUUID,
    targetOrUuid: ActorPF2e | ActorUUID,
    quantity = 1,
    newStack = true
) {
    const withContent = game.toolbelt?.getToolSetting("global", "withContent");
    const target = R.isString(targetOrUuid)
        ? await fromUuid<ActorPF2e>(targetOrUuid)
        : targetOrUuid;

    if (!(target instanceof Actor)) return;

    const item = R.isString(itemOrUuid) ? await fromUuid<ItemPF2e>(itemOrUuid) : itemOrUuid;
    const owner = item?.actor;

    if (!(item instanceof Item) || !item.isOfType("physical") || owner?.uuid === target.uuid)
        return;

    const existingQty = item.quantity ?? 0;
    if (existingQty < 1) return;

    const isContainer = item.isOfType("backpack");
    const giveQty = isContainer && withContent ? 1 : Math.clamp(quantity, 1, existingQty);

    const itemId = foundry.utils.randomID();
    const itemSource = item.toObject();

    itemSource._id = itemId;
    itemSource.system.quantity = giveQty;
    itemSource.system.equipped.carryType = "worn";

    const contentSources = withContent && isContainer ? getItemContentSources(item, itemId) : [];

    if (owner) {
        const toDelete: string[] = contentSources.map((x) => x._id);
        const remainingQty = existingQty - giveQty;

        if (remainingQty < 1) {
            toDelete.push(item.id);
        } else {
            await item.update({ "system.quantity": remainingQty });
        }

        if (toDelete.length) {
            await owner.deleteEmbeddedDocuments("Item", toDelete);
        }
    }

    if (!newStack && !isContainer) {
        const existingitem = target.inventory.findStackableItem(itemSource);

        if (existingitem) {
            return existingitem.update({ "system.quantity": existingitem.quantity + giveQty });
        }
    }

    const [newItem] = await target.createEmbeddedDocuments("Item", [itemSource], { keepId: true });

    if (newItem && contentSources.length) {
        await target.createEmbeddedDocuments("Item", contentSources, { keepId: true });
    }
}

/** @recursive */
function getItemContentSources(
    container: ContainerPF2e,
    containerId: string
): (PhysicalItemSource & { _id: string })[] {
    return container.contents
        .map((item) => {
            const itemId = foundry.utils.randomID();
            const source = item.toObject();

            source._id = itemId;
            source.system.containerId = containerId;

            return item.isOfType("backpack")
                ? [source, ...getItemContentSources(item, itemId)]
                : [source];
        })
        .flat();
}

export { giveItemToActor };
