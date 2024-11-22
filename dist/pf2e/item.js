import { getDamageRollClass } from "../classes";
import { createHTMLElement } from "../html";
import { htmlClosest } from "./dom";
import { ErrorPF2e, getActionGlyph, getActionIcon, localizer, setHasElement } from "./misc";
import { eventToRollMode, traitSlugToObject } from "./utils";
import * as R from "remeda";
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
async function consumeItem(event, item) {
    const uses = item.uses;
    if (uses.max && uses.value < 1)
        return null;
    if (["wand", "scroll"].includes(item.category) && item.system.spell) {
        return item.consume();
    }
    const actor = item.actor;
    // const multiUse = uses.max > 1;
    // const key = uses.value === 1 && multiUse ? "UseExhausted" : multiUse ? "UseMulti" : "UseSingle";
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
    const flavor = contentHTML.outerHTML;
    if (item.system.damage) {
        const DamageRoll = getDamageRollClass();
        const { formula, type, kind } = item.system.damage;
        const roll = new DamageRoll(`(${formula})[${type},${kind}]`);
        roll.toMessage({
            speaker,
            flavor,
            flags,
        });
    }
    else {
        ChatMessage.create({ speaker, content: flavor, flags });
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
async function createSelfEffectMessage(item, rollMode = "roll") {
    const ChatMessage = getDocumentClass("ChatMessage");
    const { actor, actionCost } = item;
    const token = actor.getActiveTokens(true, true).shift() ?? null;
    const speaker = ChatMessage.getSpeaker({ actor, token });
    const flavor = await renderTemplate("systems/pf2e/templates/chat/action/flavor.hbs", {
        action: { title: item.name, glyph: getActionGlyph(actionCost) },
        item,
        traits: item.system.traits.value.map((t) => traitSlugToObject(t, CONFIG.PF2E.actionTraits)),
    });
    // Get a preview slice of the message
    const previewLength = 100;
    const descriptionPreview = (() => {
        if (item.actor.pack)
            return null;
        const tempDiv = document.createElement("div");
        const documentTypes = [...CONST.DOCUMENT_LINK_TYPES, "Compendium", "UUID"];
        const linkPattern = new RegExp(`@(${documentTypes.join("|")})\\[([^#\\]]+)(?:#([^\\]]+))?](?:{([^}]+)})?`, "g");
        tempDiv.innerHTML = item.description.replace(linkPattern, (_match, ...args) => args[3]);
        return tempDiv.innerText.slice(0, previewLength);
    })();
    const description = {
        full: descriptionPreview && descriptionPreview.length < previewLength
            ? item.description
            : null,
        preview: descriptionPreview,
    };
    const content = await renderTemplate("systems/pf2e/templates/chat/action/self-effect.hbs", {
        actor: item.actor,
        description,
    });
    const flags = {
        pf2e: { context: { type: "self-effect", item: item.id } },
    };
    const messageData = ChatMessage.applyRollMode({ speaker, flavor, content, flags }, rollMode);
    return (await ChatMessage.create(messageData)) ?? null;
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
        // @ts-expect-error
        return item.traitChatData(CONFIG.PF2E.weaponTraits);
    }
    if (item.isOfType("spell")) {
        const spellcasting = item.spellcasting;
        if (!spellcasting?.statistic || item.isRitual) {
            // @ts-expect-error
            return item.traitChatData();
        }
        // @ts-expect-error
        return item.traitChatData(CONFIG.PF2E.spellTraits, R.unique([...item.traits, spellcasting.tradition]).filter(R.isTruthy));
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
        // @ts-expect-error
        return item.traitChatData(CONFIG.PF2E.featTraits, traitSlugs);
    }
    // other items don't have anything special
    // @ts-expect-error
    return item.traitChatData();
}
export { ITEM_CARRY_TYPES, PHYSICAL_ITEM_TYPES, calculateItemPrice, consumeItem, createSelfEffectMessage, detachSubitem, getActionImg, getItemChatTraits, hasFreePropertySlot, itemIsOfType, unownedItemtoMessage, };
