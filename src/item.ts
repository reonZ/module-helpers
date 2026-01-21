import {
    ActorPF2e,
    CharacterPF2e,
    ConsumablePF2e,
    CreaturePF2e,
    EquipmentPF2e,
    ItemInstances,
    ItemPF2e,
    ItemSourcePF2e,
    ItemType,
    PhysicalItemPF2e,
    ZeroToTwo,
} from "foundry-pf2e";
import {
    R,
    SYSTEM,
    createHTMLElementContent,
    getActionGlyph,
    getDamageRollClass,
    htmlQuery,
    includesAny,
    setHasElement,
    sluggify,
    traitSlugToObject,
} from ".";

/**
 * https://github.com/foundryvtt/pf2e/blob/1465f7190b2b8454094c50fa6d06e9902e0a3c41/src/module/item/base/data/values.ts#L23-L31
 */
const ITEM_CARRY_TYPES = Object.freeze([
    "attached",
    "dropped",
    "held",
    "implanted",
    "installed",
    "stowed",
    "worn",
] as const);

/**
 * https://github.com/foundryvtt/pf2e/blob/95e941aecaf1fa6082825b206b0ac02345d10538/src/module/item/physical/values.ts#L1
 */
const PHYSICAL_ITEM_TYPES = new Set([
    "ammo",
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
    type?: TType | TType[],
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

function isSupressedFeat<TActor extends ActorPF2e | null>(item: ItemPF2e<TActor>): boolean {
    return item.isOfType("feat") && item.suppressed;
}

function isItemEntry(
    item: Maybe<ClientDocument | CompendiumIndexData>,
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
    type?: TType,
): ItemInstances<TActor>[TType] | null {
    type ??= itemTypeFromUuid(uuid);

    for (const item of actorItems(actor, type)) {
        if (isSupressedFeat(item)) continue;

        const sourceId = getItemSourceId(item);
        if (sourceId === uuid) {
            return item;
        }
    }

    return null;
}

function findAllItemsWithSourceId<TType extends ItemType, TActor extends ActorPF2e>(
    actor: TActor,
    uuid: string,
    type?: TType,
): ItemInstances<TActor>[TType][] {
    const items: ItemInstances<TActor>[TType][] = [];

    for (const item of actorItems(actor, type)) {
        if (isSupressedFeat(item)) continue;

        const sourceId = getItemSourceId(item);
        if (sourceId === uuid) {
            items.push(item);
        }
    }

    return items;
}

function hasItemWithSourceId(actor: ActorPF2e, uuid: string, type?: ItemType): boolean {
    return !!findItemWithSourceId(actor, uuid, type);
}

function hasAnyItemWithSourceId(actor: ActorPF2e, uuids: string[], type?: ItemType): boolean {
    for (const item of actorItems(actor, type)) {
        if (isSupressedFeat(item)) continue;

        const sourceId = getItemSourceId(item);
        if (sourceId && uuids.includes(sourceId)) {
            return true;
        }
    }

    return false;
}

async function getItemFromUuid<T extends ItemType>(
    uuid: Maybe<string>,
    type: T,
): Promise<ItemInstances<ActorPF2e>[T] | null>;
async function getItemFromUuid(uuid: Maybe<string>, type: "physical"): Promise<PhysicalItemPF2e<ActorPF2e> | null>;
async function getItemFromUuid(uuid: Maybe<string>, type?: ItemType | "physical"): Promise<ItemPF2e | null>;
async function getItemFromUuid(uuid: Maybe<string>, type?: ItemType | "physical") {
    if (!uuid) return null;
    const item = await fromUuid<ItemPF2e>(uuid);
    return item instanceof Item && (!type || item.isOfType(type)) ? item : null;
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

async function getItemSourceFromUuid<T extends ItemType>(
    uuid: string,
    type: T,
): Promise<ItemInstances<ActorPF2e>[T]["_source"] | null>;
async function getItemSourceFromUuid(uuid: string, type: "physical"): Promise<PhysicalItemPF2e["_source"] | null>;
async function getItemSourceFromUuid(uuid: string, type?: ItemType | "physical"): Promise<ItemSourcePF2e | null>;
async function getItemSourceFromUuid(uuid: string, type?: ItemType | "physical") {
    const item = await getItemFromUuid(uuid, type);
    return !!item ? getItemSource(item) : null;
}

function getItemSourceId(item: ItemPF2e): ItemUUID {
    const isCompendiumItem = item._id && item.pack && !item.isEmbedded;
    return isCompendiumItem ? item.uuid : (item._stats.compendiumSource ?? item._stats.duplicateSource ?? item.uuid);
}

function getItemSlug(item: ItemPF2e | CompendiumIndexData): string {
    return item instanceof Item ? item.slug || sluggify(item._source.name) : sluggify(item.name);
}

function findItemWithSlug<TType extends ItemType, TActor extends ActorPF2e>(
    actor: TActor,
    slug: string,
    type?: TType,
): ItemInstances<TActor>[TType] | null {
    for (const item of actorItems(actor, type)) {
        if (isSupressedFeat(item)) continue;

        const itemSlug = getItemSlug(item);
        if (itemSlug === slug) {
            return item;
        }
    }

    return null;
}

function findAllItemsWithSlug<TType extends ItemType, TActor extends ActorPF2e>(
    actor: TActor,
    slug: string,
    type?: TType,
): ItemInstances<TActor>[TType][] {
    const items: ItemInstances<TActor>[TType][] = [];

    for (const item of actorItems(actor, type)) {
        if (isSupressedFeat(item)) continue;

        const itemSlug = getItemSlug(item);
        if (itemSlug === slug) {
            items.push(item);
        }
    }

    return items;
}

function hasItemWithSlug(actor: ActorPF2e, slug: string, type?: ItemType): boolean {
    return !!findItemWithSlug(actor, slug, type);
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
    type: "physical",
): item is PhysicalItemPF2e<TParent> | PhysicalItemPF2e["_source"];
function itemIsOfType(item: ItemOrSource, ...types: string[]): boolean {
    return (
        typeof item.name === "string" &&
        types.some((t) => (t === "physical" ? setHasElement(PHYSICAL_ITEM_TYPES, item.type) : item.type === t))
    );
}

function isCastConsumable(item: ConsumablePF2e): boolean {
    return ["wand", "scroll"].includes(item.category) && !!item.system.spell;
}

async function usePhysicalItem(event: Event, item: EquipmentPF2e<ActorPF2e> | ConsumablePF2e<ActorPF2e>) {
    const isConsumable = item.isOfType("consumable");

    if (isConsumable && isCastConsumable(item)) {
        return item.consume();
    }

    const macro = game.toolbelt?.getToolSetting("actionable", "item")
        ? await game.toolbelt.api.actionable.getItemMacro(item)
        : undefined;

    const use = isConsumable ? () => consumeItem(event, item) : () => game.pf2e.rollItemMacro(item.uuid, event);

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
        [SYSTEM.id]: {
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
        const flavor = `<h4 style="margin-bottom: .3em; font-size: 1.3em;">${use}</h4>`;

        ChatMessage.create({ speaker, content: `${flavor}${content}`, flags });
    }

    if (item.system.uses.autoDestroy && uses.value <= 1) {
        const newQuantity = Math.max(item.quantity - 1, 0);
        if (newQuantity <= 0) {
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

function getEquipAnnotation(item: Maybe<PhysicalItemPF2e>): EquipAnnotationData | undefined {
    if (!item || item.isEquipped) return;

    const { type, hands = 0 } = item.system.usage;
    const annotation = item.carryType === "dropped" ? "pick-up" : item.isStowed ? "retrieve" : "draw";
    const fullAnnotation = `${annotation}${hands}H`;
    const purposeKey = sluggify(fullAnnotation, { camel: "bactrian" });

    return {
        annotation,
        cost: annotation === "retrieve" ? 2 : 1,
        fullAnnotation,
        handsHeld: hands,
        label: `PF2E.Actions.Interact.${purposeKey}.Title`,
        carryType: type === "worn" ? "worn" : "held",
    };
}

/**
 * repurposed version of
 * https://github.com/foundryvtt/pf2e/blob/6ff777170c93618f234929c6d483a98a37cbe363/src/module/actor/character/helpers.ts#L210
 */
async function equipItemToUse(
    actor: CharacterPF2e,
    item: PhysicalItemPF2e<CreaturePF2e>,
    {
        carryType,
        handsHeld,
        fullAnnotation,
        cost,
    }: Pick<EquipAnnotationData, "carryType" | "handsHeld" | "fullAnnotation" | "cost">,
) {
    await actor.changeCarryType(item, { carryType, handsHeld });
    if (!game.combat) return;

    const templates = {
        flavor: `./systems/${SYSTEM.id}/templates/chat/action/flavor.hbs`,
        content: `./systems/${SYSTEM.id}/templates/chat/action/content.hbs`,
    };

    const fullAnnotationKey = sluggify(fullAnnotation, { camel: "bactrian" });
    const flavorAction = {
        title: `PF2E.Actions.Interact.Title`,
        subtitle: fullAnnotationKey ? `PF2E.Actions.Interact.${fullAnnotationKey}.Title` : null,
        glyph: getActionGlyph(cost),
    };

    const [traits, message] = [
        [traitSlugToObject("manipulate", CONFIG.PF2E.actionTraits)],
        `PF2E.Actions.Interact.${fullAnnotationKey}.Description`,
    ];

    const flavor = await foundry.applications.handlebars.renderTemplate(templates.flavor, {
        action: flavorAction,
        traits,
    });

    const content = await foundry.applications.handlebars.renderTemplate(templates.content, {
        imgPath: item.img,
        message: game.i18n.format(message, {
            actor: actor.name,
            weapon: item.name,
        }),
    });

    const token = actor.getActiveTokens(false, true).shift();

    await getDocumentClass("ChatMessage").create({
        content,
        speaker: ChatMessage.getSpeaker({ actor, token }),
        flavor,
        style: CONST.CHAT_MESSAGE_STYLES.EMOTE,
    });
}

function isAreaOrAutoFireType(type: string): type is "area-fire" | "auto-fire" {
    return R.isIncludedIn(type, ["area-fire", "auto-fire"]);
}

function isSF2eItem<T extends PhysicalItemPF2e>(item: T): boolean {
    return includesAny(item._source.system.traits.value, ["tech", "analog"]);
}

type EquipAnnotationData = {
    annotation: AuxiliaryAnnotation;
    cost: 1 | 2;
    fullAnnotation: string;
    handsHeld: ZeroToTwo;
    label: string;
    carryType: "held" | "worn";
};

type AuxiliaryAnnotation = "draw" | "pick-up" | "retrieve" | "sheathe";

type ItemOrSource = PreCreate<ItemSourcePF2e> | CompendiumIndexData | ItemPF2e;

export {
    ITEM_CARRY_TYPES,
    PHYSICAL_ITEM_TYPES,
    actorItems,
    equipItemToUse,
    findAllItemsWithSlug,
    findAllItemsWithSourceId,
    findItemWithSlug,
    findItemWithSourceId,
    getEquipAnnotation,
    getItemFromUuid,
    getItemSlug,
    getItemSource,
    getItemSourceFromUuid,
    getItemSourceId,
    getItemTypeLabel,
    hasAnyItemWithSourceId,
    hasItemWithSlug,
    hasItemWithSourceId,
    isAreaOrAutoFireType,
    isCastConsumable,
    isSF2eItem,
    isSupressedFeat,
    itemIsOfType,
    usePhysicalItem,
};
export type { EquipAnnotationData };
