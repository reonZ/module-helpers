import * as R from "remeda";
import { getDamageRollClass } from "../classes";
import { createHTMLElement } from "../html";
import { htmlClosest } from "./dom";
import { ErrorPF2e, getActionIcon, localizer, setHasElement } from "./misc";
import { eventToRollMode } from "./utils";
const ITEM_CARRY_TYPES = ["attached", "dropped", "held", "stowed", "worn"];
const PHYSICAL_ITEM_TYPES = new Set([
    "armor",
    "backpack",
    "book",
    "consumable",
    "equipment",
    "shield",
    "treasure",
    "weapon",
]);
async function detachSubitem(subitem, skipConfirm) {
    const parentItem = subitem.parentItem;
    if (!parentItem)
        throw ErrorPF2e("Subitem has no parent item");
    const localize = localizer("PF2E.Item.Physical.Attach.Detach");
    const confirmed = skipConfirm ||
        (await Dialog.confirm({
            title: localize("Label"),
            content: createHTMLElement("p", {
                children: [localize("Prompt", { attachable: subitem.name })],
            }).outerHTML,
        }));
    if (confirmed) {
        const deletePromise = subitem.delete();
        const createPromise = (async () => {
            // Find a stack match, cloning the subitem as worn so the search won't fail due to it being equipped
            const stack = subitem.isOfType("consumable")
                ? parentItem.actor?.inventory.findStackableItem(subitem.clone({ "system.equipped.carryType": "worn" }))
                : null;
            const keepId = !!parentItem.actor && !parentItem.actor.items.has(subitem.id);
            return (stack?.update({ "system.quantity": stack.quantity + 1 }) ??
                getDocumentClass("Item").create(foundry.utils.mergeObject(subitem.toObject(), {
                    "system.containerId": parentItem.system.containerId,
                }), { parent: parentItem.actor, keepId }));
        })();
        await Promise.all([deletePromise, createPromise]);
    }
}
async function consumeItem(event, item, thisMany = 1) {
    const uses = item.uses;
    if (uses.max && uses.value < 1)
        return null;
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
        innerHTML: (await item.toMessage(event, { create: false })).content,
    }).firstElementChild;
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
    }
    else {
        const exhausted = uses.max >= thisMany && uses.value === thisMany;
        const key = exhausted && uses.max > 1
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
        }
        else {
            return item.update({
                "system.quantity": Math.max(quantityRemaining - 1, 0),
                "system.uses.value": uses.max,
            });
        }
    }
    else {
        return item.update({
            "system.uses.value": Math.max(uses.value - 1, 0),
        });
    }
}
function hasFreePropertySlot(item) {
    const potency = item.system.runes.potency;
    return potency > 0 && item.system.runes.property.length < potency;
}
function itemIsOfType(item, ...types) {
    return (typeof item.name === "string" &&
        types.some((t) => t === "physical" ? setHasElement(PHYSICAL_ITEM_TYPES, item.type) : item.type === t));
}
function calculateItemPrice(item, quantity = 1, ratio = 1) {
    const coins = game.pf2e.Coins.fromPrice(item.price, quantity);
    return ratio === 1 ? coins : coins.scale(ratio);
}
const FEAT_ICON = "icons/sundries/books/book-red-exclamation.webp";
function getActionImg(item, itemImgFallback = false) {
    const actionIcon = getActionIcon(item.actionCost);
    const defaultIcon = getDocumentClass("Item").getDefaultArtwork(item._source).img;
    if (item.isOfType("action") && ![actionIcon, defaultIcon].includes(item.img)) {
        return item.img;
    }
    const selfEffect = item.system.selfEffect
        ? fromUuidSync(item.system.selfEffect.uuid)
        : undefined;
    if (selfEffect?.img)
        return selfEffect.img;
    if (!itemImgFallback)
        return actionIcon;
    return [actionIcon, defaultIcon, FEAT_ICON].includes(item.img) ? actionIcon : item.img;
}
async function unownedItemtoMessage(actor, item, event, options = {}) {
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
    const chatData = ChatMessagePF2e.applyRollMode({
        style: CONST.CHAT_MESSAGE_STYLES.OTHER,
        speaker: ChatMessagePF2e.getSpeaker({
            actor: actor,
            token: actor.getActiveTokens(false, true).at(0),
        }),
        content: await renderTemplate(template, templateData),
        flags: { pf2e: { origin: item.getOriginData() } },
    }, rollMode);
    // Create the chat message
    return options.create ?? true
        ? ChatMessagePF2e.create(chatData, { rollMode, renderSheet: false })
        : new ChatMessagePF2e(chatData, { rollMode });
}
/**
 * `traits` retrieved in the `getChatData` across the different items
 */
function getItemChatTraits(item) {
    if (item.isOfType("weapon")) {
        return /** protected */ item["traitChatData"](CONFIG.PF2E.weaponTraits);
    }
    if (item.isOfType("spell")) {
        const spellcasting = item.spellcasting;
        if (!spellcasting?.statistic || item.isRitual) {
            return /** protected */ item["traitChatData"]();
        }
        return /** protected */ item["traitChatData"](CONFIG.PF2E.spellTraits, R.unique([...item.traits, spellcasting.tradition]).filter(R.isTruthy));
    }
    if (item.isOfType("feat")) {
        const actor = item.actor;
        const classSlug = actor.isOfType("character") && actor.class?.slug;
        const traitSlugs = ["class", "classfeature"].includes(item.category) &&
            actor.isOfType("character") &&
            classSlug &&
            item.system.traits.value.includes(classSlug)
            ? item.system.traits.value.filter((t) => t === classSlug || !(t in CONFIG.PF2E.classTraits))
            : item.system.traits.value;
        return /** protected */ item["traitChatData"](CONFIG.PF2E.featTraits, traitSlugs);
    }
    // other items don't have anything special
    return /** protected */ item["traitChatData"]();
}
/** Save data from an effect item dropped on an ability or feat sheet. Returns true if handled */
async function handleSelfEffectDrop(sheet, item) {
    if (!sheet.isEditable || sheet.item.system.actionType.value === "passive") {
        return false;
    }
    if (!item?.isOfType("effect"))
        return false;
    await sheet.item.update({ "system.selfEffect": { uuid: item.uuid, name: item.name } });
    return true;
}
export { ITEM_CARRY_TYPES, PHYSICAL_ITEM_TYPES, calculateItemPrice, consumeItem, detachSubitem, getActionImg, getItemChatTraits, handleSelfEffectDrop, hasFreePropertySlot, itemIsOfType, unownedItemtoMessage, };
