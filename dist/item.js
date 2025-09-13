import { createHTMLElementContent, getActionGlyph, getDamageRollClass, htmlQuery, isInstanceOf, R, setHasElement, traitSlugToObject, } from ".";
const ITEM_CARRY_TYPES = ["attached", "dropped", "held", "stowed", "worn"];
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
]);
function* actorItems(actor, type) {
    const types = R.isArray(type) && type.length
        ? type
        : typeof type === "string"
            ? [type]
            : R.keys(CONFIG.PF2E.Item.documentClasses);
    for (const type of types) {
        for (const item of actor.itemTypes[type]) {
            yield item;
        }
    }
}
function isSupressedFeat(item) {
    return item.isOfType("feat") && item.suppressed;
}
function isItemEntry(item) {
    return R.isObjectType(item) && "type" in item && item.type in CONFIG.PF2E.Item.documentClasses;
}
function itemTypeFromUuid(uuid) {
    const item = fromUuidSync(uuid);
    return isItemEntry(item) ? item.type : undefined;
}
function findItemWithSourceId(actor, uuid, type) {
    type ??= itemTypeFromUuid(uuid);
    for (const item of actorItems(actor, type)) {
        if (isSupressedFeat(item))
            continue;
        const sourceId = item.sourceId;
        if (sourceId === uuid) {
            return item;
        }
    }
    return null;
}
function hasItemWithSourceId(actor, uuid, type) {
    return !!findItemWithSourceId(actor, uuid, type);
}
function hasAnyItemWithSourceId(actor, uuids, type) {
    for (const item of actorItems(actor, type)) {
        if (isSupressedFeat(item))
            continue;
        const sourceId = item.sourceId;
        if (sourceId && uuids.includes(sourceId)) {
            return true;
        }
    }
    return false;
}
async function getItemFromUuid(uuid, instance) {
    if (!uuid)
        return null;
    const item = await fromUuid(uuid);
    return item instanceof Item && (!instance || isInstanceOf(item, instance)) ? item : null;
}
function getItemSource(item, clearId) {
    const source = item.toObject();
    source._stats.compendiumSource ??= item.uuid;
    if (clearId) {
        // @ts-expect-error
        delete source._id;
    }
    return source;
}
async function getItemSourceFromUuid(uuid, instance) {
    const item = await getItemFromUuid(uuid, instance);
    return !!item ? getItemSource(item) : null;
}
function getItemSourceId(item) {
    return item.sourceId ?? item.uuid;
}
function getItemSlug(item) {
    return item.slug ?? game.pf2e.system.sluggify(item._source.name);
}
function findItemWithSlug(actor, slug, type) {
    for (const item of actorItems(actor, type)) {
        if (isSupressedFeat(item))
            continue;
        const itemSlug = getItemSlug(item);
        if (itemSlug === slug) {
            return item;
        }
    }
    return null;
}
function findAllItemsWithSlug(actor, slug, type) {
    const items = [];
    for (const item of actorItems(actor, type)) {
        if (isSupressedFeat(item))
            continue;
        const itemSlug = getItemSlug(item);
        if (itemSlug === slug) {
            items.push(item);
        }
    }
    return items;
}
function hasItemWithSlug(actor, slug, type) {
    return !!findItemWithSlug(actor, slug, type);
}
function itemIsOfType(item, ...types) {
    return (typeof item.name === "string" &&
        types.some((t) => t === "physical" ? setHasElement(PHYSICAL_ITEM_TYPES, item.type) : item.type === t));
}
function isCastConsumable(item) {
    return ["wand", "scroll"].includes(item.category) && !!item.system.spell;
}
async function usePhysicalItem(event, item) {
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
                const msg = game.toolbelt.localize("actionable.item.cancel", item);
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
async function consumeItem(event, item) {
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
    }
    else {
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
        const isPreservedAmmo = item.category === "ammo" && item.system.rules.length > 0;
        if (newQuantity <= 0 && !isPreservedAmmo) {
            await item.delete();
        }
        else {
            await item.update({
                "system.quantity": newQuantity,
                "system.uses.value": uses.max,
            });
        }
    }
    else {
        await item.update({
            "system.uses.value": Math.max(uses.value - 1, 0),
        });
    }
}
function getItemTypeLabel(type) {
    return game.i18n.localize(`TYPES.Item.${type}`);
}
function getEquipAnnotation(item) {
    if (!item || item.isEquipped)
        return;
    const { type, hands = 0 } = item.system.usage;
    const annotation = item.carryType === "dropped" ? "pick-up" : item.isStowed ? "retrieve" : "draw";
    const fullAnnotation = `${annotation}${hands}H`;
    const purposeKey = game.pf2e.system.sluggify(fullAnnotation, { camel: "bactrian" });
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
async function equipItemToUse(actor, item, { carryType, handsHeld, fullAnnotation, cost, }) {
    await actor.changeCarryType(item, { carryType, handsHeld });
    if (!game.combat)
        return;
    const templates = {
        flavor: "./systems/pf2e/templates/chat/action/flavor.hbs",
        content: "./systems/pf2e/templates/chat/action/content.hbs",
    };
    const sluggify = game.pf2e.system.sluggify;
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
export { actorItems, equipItemToUse, findAllItemsWithSlug, findItemWithSlug, findItemWithSourceId, getEquipAnnotation, getItemFromUuid, getItemSource, getItemSourceFromUuid, getItemSourceId, getItemTypeLabel, hasAnyItemWithSourceId, hasItemWithSlug, hasItemWithSourceId, isCastConsumable, isSupressedFeat, ITEM_CARRY_TYPES, itemIsOfType, usePhysicalItem, };
