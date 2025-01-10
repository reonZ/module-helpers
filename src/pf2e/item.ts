import {
    AbilityItemPF2e,
    ActorPF2e,
    ConsumablePF2e,
    FeatPF2e,
    ItemInstances,
    ItemPF2e,
    ItemSourcePF2e,
    ItemType,
    PhysicalItemPF2e,
    WeaponPF2e,
} from "foundry-pf2e";
import * as R from "remeda";
import { getDamageRollClass } from "../classes";
import { createHTMLElement } from "../html";
import { htmlClosest } from "./dom";
import { ErrorPF2e, getActionIcon, localizer, setHasElement } from "./misc";
import { eventToRollMode } from "./utils";

const ITEM_CARRY_TYPES = ["attached", "dropped", "held", "stowed", "worn"] as const;

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

async function detachSubitem(subitem: PhysicalItemPF2e, skipConfirm: boolean): Promise<void> {
    const parentItem = subitem.parentItem;
    if (!parentItem) throw ErrorPF2e("Subitem has no parent item");

    const localize = localizer("PF2E.Item.Physical.Attach.Detach");
    const confirmed =
        skipConfirm ||
        (await Dialog.confirm({
            title: localize("Label"),
            content: createHTMLElement("p", {
                children: [localize("Prompt", { attachable: subitem.name })],
            }).outerHTML,
        }));

    if (confirmed) {
        const deletePromise = subitem.delete();
        const createPromise = (async (): Promise<unknown> => {
            // Find a stack match, cloning the subitem as worn so the search won't fail due to it being equipped
            const stack = subitem.isOfType("consumable")
                ? parentItem.actor?.inventory.findStackableItem(
                      subitem.clone({ "system.equipped.carryType": "worn" })
                  )
                : null;
            const keepId = !!parentItem.actor && !parentItem.actor.items.has(subitem.id);
            return (
                stack?.update({ "system.quantity": stack.quantity + 1 }) ??
                getDocumentClass("Item").create(
                    foundry.utils.mergeObject(subitem.toObject(), {
                        "system.containerId": parentItem.system.containerId,
                    }),
                    { parent: parentItem.actor, keepId }
                )
            );
        })();

        await Promise.all([deletePromise, createPromise]);
    }
}

async function consumeItem(event: Event, item: ConsumablePF2e, thisMany: number = 1) {
    const uses = item.uses;
    if (uses.max && uses.value < 1) return null;

    if (["wand", "scroll"].includes(item.category) && item.system.spell) {
        return item.consume();
    }

    const actor = item.actor;
    const flags = {
        pf2e: {
            origin: {
                sourceId: item.sourceId,
                uuid: item.uuid,
                type: item.type,
            },
        },
    };
    const speaker = ChatMessage.getSpeaker({ actor });
    const contentHTML = createHTMLElement("div", {
        innerHTML: (await item.toMessage(event, { create: false }))!.content,
    }).firstElementChild as HTMLElement;

    contentHTML.querySelector("button[data-action='consume']")?.remove();
    contentHTML.querySelector("footer")?.remove();

    const content = contentHTML.outerHTML;

    if (item.system.damage) {
        const DamageRoll = getDamageRollClass();
        const { formula, type, kind } = item.system.damage;
        const roll = new DamageRoll(`(${formula})[${type},${kind}]`);

        roll.toMessage({
            speaker,
            flavor: content,
            flags,
        });
    } else {
        const exhausted = uses.max >= thisMany && uses.value === thisMany;
        const key =
            exhausted && uses.max > 1
                ? "UseExhausted"
                : uses.max > thisMany
                ? "UseMulti"
                : "UseSingle";
        const use = game.i18n.format(`PF2E.ConsumableMessage.${key}`, {
            name: item.name,
            current: uses.value - thisMany,
        });
        const flavor = `<h4>${use}</h4>`;

        ChatMessage.create({ speaker, content: `${flavor}${content}`, flags });
    }

    if (item.system.uses.autoDestroy && uses.value <= 1) {
        const quantityRemaining = item.quantity;

        const isPreservedAmmo = item.category === "ammo" && item.system.rules.length > 0;
        if (quantityRemaining <= 1 && !isPreservedAmmo) {
            return item.delete();
        } else {
            return item.update({
                "system.quantity": Math.max(quantityRemaining - 1, 0),
                "system.uses.value": uses.max,
            });
        }
    } else {
        return item.update({
            "system.uses.value": Math.max(uses.value - 1, 0),
        });
    }
}

function hasFreePropertySlot(item: WeaponPF2e) {
    const potency = item.system.runes.potency;
    return potency > 0 && item.system.runes.property.length < potency;
}

/** Determine in a type-safe way whether an `ItemPF2e` or `ItemSourcePF2e` is among certain types */
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

function calculateItemPrice(item: PhysicalItemPF2e, quantity = 1, ratio = 1) {
    const coins = game.pf2e.Coins.fromPrice(item.price, quantity);
    return ratio === 1 ? coins : coins.scale(ratio);
}

const FEAT_ICON = "icons/sundries/books/book-red-exclamation.webp";
function getActionImg(
    item: FeatPF2e | AbilityItemPF2e,
    itemImgFallback: boolean = false
): ImageFilePath {
    const actionIcon = getActionIcon(item.actionCost);
    const defaultIcon = getDocumentClass("Item").getDefaultArtwork(item._source).img;

    if (item.isOfType("action") && ![actionIcon, defaultIcon].includes(item.img)) {
        return item.img;
    }

    const selfEffect = item.system.selfEffect
        ? fromUuidSync(item.system.selfEffect.uuid)
        : undefined;

    if (selfEffect?.img) return selfEffect.img;
    if (!itemImgFallback) return actionIcon;

    return [actionIcon, defaultIcon, FEAT_ICON].includes(item.img) ? actionIcon : item.img;
}

async function unownedItemtoMessage(
    actor: ActorPF2e,
    item: ItemPF2e,
    event?: Maybe<Event | JQuery.TriggeredEvent>,
    options: { rollMode?: RollMode | "roll"; create?: boolean; data?: Record<string, unknown> } = {}
): Promise<ChatMessage | undefined> {
    const sluggify = game.pf2e.system.sluggify;
    const ChatMessagePF2e = getDocumentClass("ChatMessage");

    // Basic template rendering data
    const template = `systems/pf2e/templates/chat/${sluggify(item.type)}-card.hbs`;
    const token = actor.token;
    const nearestItem = htmlClosest(event?.target, ".item");
    const rollOptions = options.data ?? { ...(nearestItem?.dataset ?? {}) };
    const templateData = {
        actor: actor,
        tokenId: token ? `${token.parent?.id}.${token.id}` : null,
        item,
        data: await item.getChatData(undefined, rollOptions),
    };

    // Basic chat message data
    const originalEvent = event instanceof Event ? event : event?.originalEvent;
    const rollMode = options.rollMode ?? eventToRollMode(originalEvent);
    const chatData = ChatMessagePF2e.applyRollMode(
        {
            style: CONST.CHAT_MESSAGE_STYLES.OTHER,
            speaker: ChatMessagePF2e.getSpeaker({
                actor: actor,
                token: actor.getActiveTokens(false, true).at(0),
            }),
            content: await renderTemplate(template, templateData),
            flags: { pf2e: { origin: item.getOriginData() } },
        },
        rollMode
    );

    // Create the chat message
    return options.create ?? true
        ? ChatMessagePF2e.create(chatData, { rollMode, renderSheet: false })
        : new ChatMessagePF2e(chatData, { rollMode });
}

/**
 * `traits` retrieved in the `getChatData` across the different items
 */
function getItemChatTraits(item: ItemPF2e<ActorPF2e>) {
    if (item.isOfType("weapon")) {
        return /** protected */ item["traitChatData"](CONFIG.PF2E.weaponTraits);
    }

    if (item.isOfType("spell")) {
        const spellcasting = item.spellcasting;

        if (!spellcasting?.statistic || item.isRitual) {
            return /** protected */ item["traitChatData"]();
        }

        return /** protected */ item["traitChatData"](
            CONFIG.PF2E.spellTraits,
            R.unique([...item.traits, spellcasting.tradition]).filter(R.isTruthy)
        );
    }

    if (item.isOfType("feat")) {
        const actor = item.actor;
        const classSlug = actor.isOfType("character") && actor.class?.slug;

        const traitSlugs =
            ["class", "classfeature"].includes(item.category) &&
            actor.isOfType("character") &&
            classSlug &&
            item.system.traits.value.includes(classSlug)
                ? item.system.traits.value.filter(
                      (t) => t === classSlug || !(t in CONFIG.PF2E.classTraits)
                  )
                : item.system.traits.value;

        return /** protected */ item["traitChatData"](CONFIG.PF2E.featTraits, traitSlugs);
    }

    // other items don't have anything special
    return /** protected */ item["traitChatData"]();
}

type ItemOrSource = PreCreate<ItemSourcePF2e> | ItemPF2e;

export {
    ITEM_CARRY_TYPES,
    PHYSICAL_ITEM_TYPES,
    calculateItemPrice,
    consumeItem,
    detachSubitem,
    getActionImg,
    getItemChatTraits,
    hasFreePropertySlot,
    itemIsOfType,
    unownedItemtoMessage,
};
