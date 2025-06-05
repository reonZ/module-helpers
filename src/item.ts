import {
    ActorPF2e,
    ConsumablePF2e,
    EquipmentPF2e,
    FeatPF2e,
    ItemInstances,
    ItemPF2e,
    ItemSourcePF2e,
    ItemType,
    PhysicalItemPF2e,
} from "foundry-pf2e";
import {
    createHTMLElementContent,
    getDamageRollClass,
    htmlQuery,
    isInstanceOf,
    IsInstanceOfItem,
    IsInstanceOfItems,
    R,
    setHasElement,
} from ".";

/**
 * https://github.com/foundryvtt/pf2e/blob/95e941aecaf1fa6082825b206b0ac02345d10538/src/module/item/physical/values.ts#L1
 */
const PHYSICAL_ITEM_TYPES = new Set([
    "armor",
    "backpack",
    "book",
    "consumable",
    "equipment",
    "shield",
    "treasure",
    "weapon",
] as const);

function* actorItems<TType extends ItemType, TActor extends ActorPF2e>(
    actor: TActor,
    type?: TType | TType[]
): Generator<ItemInstances<TActor>[TType]> {
    const types =
        R.isArray(type) && type.length
            ? type
            : typeof type === "string"
            ? [type]
            : R.keys(CONFIG.PF2E.Item.documentClasses);

    for (const type of types) {
        for (const item of actor.itemTypes[type]) {
            yield item as ItemInstances<TActor>[TType];
        }
    }
}

function isSupressedFeat<TActor extends ActorPF2e | null>(
    item: ItemPF2e<TActor>
): item is FeatPF2e<TActor> {
    return item.isOfType("feat") && item.suppressed;
}

function isItemEntry(
    item: Maybe<ClientDocument | CompendiumIndexData>
): item is (CompendiumIndexData & { type: ItemType }) | ItemPF2e {
    return R.isObjectType(item) && "type" in item && item.type in CONFIG.PF2E.Item.documentClasses;
}

function itemTypeFromUuid<TType extends ItemType>(uuid: string) {
    const item = fromUuidSync(uuid);
    return isItemEntry(item) ? (item.type as TType) : undefined;
}

function findItemWithSourceId<TType extends ItemType, TActor extends ActorPF2e>(
    actor: TActor,
    uuid: string,
    type?: TType
): ItemInstances<TActor>[TType] | null {
    type ??= itemTypeFromUuid(uuid);

    for (const item of actorItems(actor, type)) {
        if (isSupressedFeat(item)) continue;

        const sourceId = item.sourceId;
        if (sourceId === uuid) {
            return item;
        }
    }

    return null;
}

function hasItemWithSourceId(actor: ActorPF2e, uuid: string, type?: ItemType): boolean {
    return !!findItemWithSourceId(actor, uuid, type);
}

async function getItemFromUuid<T extends IsInstanceOfItem>(
    uuid: Maybe<string>,
    instance?: T
): Promise<IsInstanceOfItems[T] | null>;
async function getItemFromUuid(uuid: Maybe<string>, instance?: string): Promise<ItemPF2e | null>;
async function getItemFromUuid(uuid: Maybe<string>, instance?: string) {
    if (!uuid) return null;
    const item = await fromUuid<ItemPF2e>(uuid);
    return item instanceof Item && (!instance || isInstanceOf(item, instance)) ? item : null;
}

function getItemSource<T extends ItemPF2e>(item: T, clearId?: boolean): T["_source"] {
    const source = item.toObject();

    source._stats.compendiumSource ??= item.uuid;

    if (clearId) {
        // @ts-expect-error
        delete source._id;
    }

    return source;
}

async function getItemSourceFromUuid<T extends IsInstanceOfItem>(
    uuid: string,
    instance?: T
): Promise<IsInstanceOfItems[T]["_source"] | null>;
async function getItemSourceFromUuid(
    uuid: string,
    instance?: string
): Promise<ItemSourcePF2e | null>;
async function getItemSourceFromUuid(uuid: string, instance?: string) {
    const item = await getItemFromUuid(uuid, instance);
    return !!item ? getItemSource(item) : null;
}

function getItemSourceId(item: ItemPF2e): string {
    return item.sourceId ?? item.uuid;
}

/**
 * https://github.com/foundryvtt/pf2e/blob/95e941aecaf1fa6082825b206b0ac02345d10538/src/module/item/helpers.ts#L13
 */
function itemIsOfType<TParent extends ActorPF2e | null, TType extends ItemType>(
    item: ItemOrSource,
    ...types: TType[]
): item is ItemInstances<TParent>[TType] | ItemInstances<TParent>[TType]["_source"];
function itemIsOfType<TParent extends ActorPF2e | null, TType extends "physical" | ItemType>(
    item: ItemOrSource,
    ...types: TType[]
): item is TType extends "physical"
    ? PhysicalItemPF2e<TParent> | PhysicalItemPF2e<TParent>["_source"]
    : TType extends ItemType
    ? ItemInstances<TParent>[TType] | ItemInstances<TParent>[TType]["_source"]
    : never;
function itemIsOfType<TParent extends ActorPF2e | null>(
    item: ItemOrSource,
    type: "physical"
): item is PhysicalItemPF2e<TParent> | PhysicalItemPF2e["_source"];
function itemIsOfType(item: ItemOrSource, ...types: string[]): boolean {
    return (
        typeof item.name === "string" &&
        types.some((t) =>
            t === "physical" ? setHasElement(PHYSICAL_ITEM_TYPES, item.type) : item.type === t
        )
    );
}

function isCastConsumable(item: ConsumablePF2e): boolean {
    return ["wand", "scroll"].includes(item.category) && !!item.system.spell;
}

async function usePhysicalItem(
    event: Event,
    item: EquipmentPF2e<ActorPF2e> | ConsumablePF2e<ActorPF2e>
) {
    const isConsumable = item.isOfType("consumable");

    if (isConsumable && isCastConsumable(item)) {
        return item.consume();
    }

    const macro = game.toolbelt?.getToolSetting("actionable", "item")
        ? await game.toolbelt.api.actionable.getItemMacro(item)
        : undefined;

    const use = isConsumable
        ? () => consumeItem(event, item)
        : () => game.pf2e.rollItemMacro(item.uuid, event);

    if (macro) {
        // we let the macro handle item consumption
        return macro.execute({
            actor: item.actor,
            item,
            use,
            cancel: () => {
                const msg = game.toolbelt!.localize("actionable.item.cancel", item);
                return ui.notifications.warn(msg, { localize: false });
            },
        });
    }

    return use();
}

/**
 * upgraded version of
 * https://github.com/foundryvtt/pf2e/blob/eecf53f37490cbd228d8c74b290748b0188768b4/src/module/item/consumable/document.ts#L156
 * though stripped of scrolls & wands
 */
async function consumeItem(event: Event, item: ConsumablePF2e<ActorPF2e>) {
    const actor = item.actor;
    const speaker = ChatMessage.getSpeaker({ actor });
    const flags = {
        pf2e: {
            origin: {
                sourceId: item.sourceId,
                uuid: item.uuid,
                type: item.type,
            },
        },
    };

    const contentHTML = createHTMLElementContent({
        content: (await item.toMessage(event, { create: false }))?.content,
    });

    htmlQuery(contentHTML, "footer")?.remove();
    htmlQuery(contentHTML, "button[data-action='consume']")?.remove();

    const uses = item.uses;
    const content = contentHTML.outerHTML;

    if (item.system.damage) {
        const DamageRoll = getDamageRollClass();
        const { formula, type, kind } = item.system.damage;
        const roll = new DamageRoll(`(${formula})[${type},${kind}]`);

        roll.toMessage({ speaker, flavor: content, flags });
    } else {
        const key = uses.max > 1 && uses.value > 1 ? "UseMulti" : "UseSingle";
        const use = game.i18n.format(`PF2E.ConsumableMessage.${key}`, {
            name: item.name,
            current: uses.value - 1,
        });
        const flavor = `<h4>${use}</h4>`;

        ChatMessage.create({ speaker, content: `${flavor}${content}`, flags });
    }

    if (item.system.uses.autoDestroy && uses.value <= 1) {
        const newQuantity = Math.max(item.quantity - 1, 0);
        const isPreservedAmmo = item.category === "ammo" && item.system.rules.length > 0;
        if (newQuantity <= 0 && !isPreservedAmmo) {
            await item.delete();
        } else {
            await item.update({
                "system.quantity": newQuantity,
                "system.uses.value": uses.max,
            });
        }
    } else {
        await item.update({
            "system.uses.value": Math.max(uses.value - 1, 0),
        });
    }
}

function getItemTypeLabel(type: ItemType) {
    return game.i18n.localize(`TYPES.Item.${type}`);
}

type ItemOrSource = PreCreate<ItemSourcePF2e> | CompendiumIndexData | ItemPF2e;

export {
    actorItems,
    findItemWithSourceId,
    getItemFromUuid,
    getItemSource,
    getItemSourceFromUuid,
    getItemSourceId,
    getItemTypeLabel,
    hasItemWithSourceId,
    isCastConsumable,
    itemIsOfType,
    usePhysicalItem,
};
