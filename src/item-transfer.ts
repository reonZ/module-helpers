import {
    ActionCost,
    ActorPF2e,
    ChatMessagePF2e,
    ContainerPF2e,
    PhysicalItemPF2e,
    PhysicalItemSource,
    TraitViewData,
} from "foundry-pf2e";
import * as R from "remeda";
import { getActionGlyph, getHighestName, htmlQuery } from ".";

async function initiateTransfer({
    item,
    targetActor,
    prompt,
    title,
}: {
    item: PhysicalItemPF2e;
    targetActor?: ActorPF2e;
    title?: string;
    prompt?: string;
}): Promise<MoveLootFormData | null> {
    if (item.quantity <= 0) {
        return null;
    }

    if (item.isOfType("backpack") || item.quantity === 1) {
        return { quantity: 1, newStack: false };
    }

    return new ItemTransferDialog(item, {
        targetActor,
        lockStack: !targetActor?.inventory.findStackableItem(item._source),
        title,
        prompt,
        button: title,
    }).resolve();
}

async function getTransferData({
    item,
    quantity,
    withContent,
}: {
    item: PhysicalItemPF2e;
    withContent?: boolean;
    quantity?: number;
}): Promise<{
    itemSource: PhysicalItemSource;
    contentSources: PhysicalItemSource[];
    quantity: number;
} | null> {
    const realQuantity = getRealQuantity(item, quantity);
    if (realQuantity <= 0) return null;

    const itemId = foundry.utils.randomID();
    const itemSource = item.toObject();

    itemSource._id = itemId;
    itemSource.system.quantity = realQuantity;
    itemSource.system.equipped.carryType = "worn";

    if ("invested" in itemSource.system.equipped) {
        itemSource.system.equipped.invested = item.traits.has("invested") ? false : null;
    }

    const contentSources =
        item.isOfType("backpack") && withContent ? getItemContentSource(item, itemId) : [];

    return { itemSource, contentSources, quantity: realQuantity };
}

async function addItemsToActor({
    targetActor,
    itemSource,
    contentSources = [],
    newStack,
}: {
    targetActor: ActorPF2e;
    itemSource: PhysicalItemSource;
    contentSources: PhysicalItemSource[];
    newStack?: boolean;
}) {
    if (!newStack && itemSource.type !== "backpack") {
        const existingitem = targetActor.inventory.findStackableItem(itemSource);
        if (existingitem) {
            await existingitem.update({
                "system.quantity": existingitem.quantity + itemSource.system.quantity,
            });
            return { item: existingitem, contentItems: [] };
        }
    }

    const isContainer = contentSources.length > 0;
    const [newItem] = await targetActor.createEmbeddedDocuments("Item", [itemSource], {
        keepId: isContainer,
    });

    if (!newItem) return null;

    const contentItems = contentSources.length
        ? await targetActor.createEmbeddedDocuments("Item", contentSources, {
              keepId: isContainer,
          })
        : [];

    return { item: newItem, contentItems };
}

async function updateTransferSource({
    item,
    withContent,
    quantity,
}: {
    item: PhysicalItemPF2e;
    withContent?: boolean;
    quantity?: number;
}) {
    const sourceActor = item.actor;
    if (!sourceActor) return false;

    const realQuantity = getRealQuantity(item, quantity);
    if (realQuantity <= 0) return false;

    const toDelete: string[] =
        item.isOfType("backpack") && withContent ? getItemContentIds(item) : [];

    const newQuantity = item.quantity - realQuantity;

    if (newQuantity <= 0) {
        toDelete.push(item.id);
    } else {
        await item.update({ "system.quantity": newQuantity });
    }

    if (toDelete.length) {
        await sourceActor.deleteEmbeddedDocuments("Item", toDelete);
    }

    return true;
}

async function createTransferMessage({
    sourceActor,
    targetActor,
    subtitle,
    message,
    quantity,
    userId,
    item,
    cost,
}: {
    sourceActor: ActorPF2e;
    targetActor?: ActorPF2e;
    subtitle: string;
    message: string;
    item: { img: string; link?: string };
    quantity?: number;
    cost?: TransferCost;
    userId?: string;
}): Promise<ChatMessagePF2e | undefined> {
    const sourceName = getHighestName(sourceActor);
    const targetName = targetActor ? getHighestName(targetActor) : "";

    const glyph = getActionGlyph(
        cost ?? (sourceActor.isOfType("loot") && targetActor?.isOfType("loot") ? 2 : 1)
    );

    const formatProperties = {
        source: sourceName,
        target: targetName,
        seller: sourceName,
        buyer: targetName,
        quantity: quantity ?? 1,
        item: item.link ? await TextEditor.enrichHTML(item.link) : "",
    };

    const traits: TraitViewData[] = [
        {
            name: "manipulate",
            label: CONFIG.PF2E.featTraits.manipulate,
            description: CONFIG.PF2E.traitsDescriptions.manipulate,
        },
    ];

    const flavor = await renderTemplate("./systems/pf2e/templates/chat/action/flavor.hbs", {
        action: { title: "PF2E.Actions.Interact.Title", subtitle, glyph },
        traits,
    });

    const content = await renderTemplate("./systems/pf2e/templates/chat/action/content.hbs", {
        imgPath: item.img,
        message: game.i18n.format(message, formatProperties).replace(/\b1 × /, ""),
    });

    return getDocumentClass("ChatMessage").create({
        author: userId ?? game.user.id,
        speaker: { alias: sourceName },
        style: CONST.CHAT_MESSAGE_STYLES.EMOTE,
        flavor,
        content,
    });
}

function getItemContentIds(item: ContainerPF2e) {
    return item.contents
        .map((x): string[] => (x.isOfType("backpack") ? [x.id, ...getItemContentIds(x)] : [x.id]))
        .flat();
}

function getItemContentSource(item: ContainerPF2e, containerId: string) {
    return item.contents
        .map((x): PhysicalItemSource[] => {
            const itemId = foundry.utils.randomID();
            const source = x.toObject();

            source._id = itemId;
            source.system.containerId = containerId;

            return x.isOfType("backpack") ? [source, ...getItemContentSource(x, itemId)] : [source];
        })
        .flat();
}

function getRealQuantity(item: PhysicalItemPF2e, quantity?: number) {
    quantity = item.isOfType("backpack") ? 1 : quantity ?? item.quantity;
    return Math.min(item.quantity, quantity);
}

class ItemTransferDialog extends FormApplication<PhysicalItemPF2e, MoveLootOptions> {
    #resolve: ((value: MoveLootFormData | null) => void) | null = null;

    static override get defaultOptions(): MoveLootOptions {
        return {
            ...super.defaultOptions,
            id: "ItemTransferDialog",
            classes: ["dialog", "item-transfer"],
            template: "systems/pf2e/templates/popups/item-transfer-dialog.hbs",
            width: "auto",
            height: "auto",
            newStack: false,
            lockStack: false,
        };
    }

    override get title(): string {
        return this.options.title || game.i18n.localize("PF2E.loot.MoveLoot");
    }

    get item(): PhysicalItemPF2e {
        return this.object;
    }

    override async getData(): Promise<PopupData> {
        const item = this.item;
        const prompt = this.options.prompt || game.i18n.localize("PF2E.loot.MoveLootMessage");

        return {
            ...(await super.getData()),
            item,
            quantity: item.quantity,
            newStack: this.options.newStack,
            lockStack: this.options.lockStack,
            canGift: false,
            prompt,
        };
    }

    protected async _renderInner(
        data: FormApplicationData<PhysicalItemPF2e>,
        options: RenderOptions
    ): Promise<JQuery> {
        const $html = await super._renderInner(data, options);

        if (this.options.button) {
            $html.find("button").text(this.options.button);
        }

        return $html;
    }

    /**
     * Shows the dialog and resolves how many to transfer and what action to perform.
     * In situations where there are no choices (quantity is 1 and its a player purchasing), this returns immediately.
     */
    async resolve(): Promise<MoveLootFormData | null> {
        this.render(true);
        return new Promise((resolve) => {
            this.#resolve = resolve;
        });
    }

    override activateListeners($html: JQuery<HTMLElement>): void {
        super.activateListeners($html);
        const html = $html[0];

        const priceElement = htmlQuery(html, ".price");
        const quantityInput = htmlQuery<HTMLInputElement>(html, "input[name=quantity]");

        // If the price element exists, update it and listen for quantity changes
        if (priceElement) {
            const getQuantity = () =>
                Math.clamp(Number(quantityInput?.value ?? 1), 1, this.item.quantity);
            const updatePrice = () => {
                const quantity = Math.clamp(
                    Number(quantityInput?.value ?? 1),
                    1,
                    this.item.quantity
                );
                const cost = game.pf2e.Coins.fromPrice(this.item.price, quantity);
                priceElement.innerText = `(${cost.toString()})`;
            };

            updatePrice();

            quantityInput?.addEventListener("input", () => {
                updatePrice();
            });

            quantityInput?.addEventListener("blur", () => {
                quantityInput.value = String(getQuantity());
                updatePrice();
            });
        }
    }

    override async _updateObject(
        event: SubmitEvent,
        formData: Record<string, unknown> & MoveLootFormData
    ): Promise<void> {
        if (R.isNumber(formData.quantity) && formData.quantity > 0) {
            this.#resolve?.({
                quantity: formData.quantity,
                newStack: formData.newStack,
            });
        } else {
            this.#resolve?.(null);
        }

        this.#resolve = null;
    }

    override async close(options?: { force?: boolean }): Promise<void> {
        this.#resolve?.(null);
        return super.close(options);
    }
}

interface MoveLootOptions extends FormApplicationOptions {
    targetActor?: ActorPF2e;
    newStack: boolean;
    lockStack: boolean;
    prompt?: string;
    button?: string;
}

interface MoveLootFormData {
    quantity: number;
    newStack: boolean;
}

interface PopupData extends FormApplicationData {
    item: PhysicalItemPF2e;
    quantity: number;
    canGift: boolean;
    newStack: boolean;
    lockStack: boolean;
    prompt: string;
}

type TransferCost = string | number | null | ActionCost;

export {
    addItemsToActor,
    createTransferMessage,
    getRealQuantity,
    getTransferData,
    initiateTransfer,
    updateTransferSource,
};
export type { MoveLootFormData };
