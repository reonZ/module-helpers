import * as R from "remeda";
import { isInstanceOf } from "./object";
import { getActionGlyph, traitSlugToObject } from "./pf2e";
const EXCLUDED_TYPES = ["affliction"];
const HANDWRAPS_SLUG = "handwraps-of-mighty-blows";
const BANDS_OF_FORCE_SLUGS = [
    "bands-of-force",
    "bands-of-force-greater",
    "bands-of-force-major",
];
function getEquippedHandwraps(actor) {
    return actor.itemTypes.weapon.find((weapon) => {
        const { category, slug, equipped, identification, traits } = weapon._source.system;
        const { carryType, invested, inSlot } = equipped;
        return (category === "unarmed" &&
            carryType === "worn" &&
            inSlot &&
            invested &&
            identification.status === "identified" &&
            (slug === HANDWRAPS_SLUG || traits.otherTags.includes(HANDWRAPS_SLUG)));
    });
}
function getCarryTypeActionData(item, annotation, action = "interact") {
    switch (annotation) {
        case "draw":
            return [1, "held"];
        case "pick-up":
            return [1, "held"];
        case "retrieve": {
            const { container } = item;
            if (container?.isHeld)
                return [1, "held"];
            const usage = container?.system.usage;
            const actionCost = usage?.type === "held" || usage?.where === "backpack" ? 2 : 1;
            return [actionCost, "held"];
        }
        case "grip":
            return [action === "interact" ? 1 : 0, "held"];
        case "sheathe":
            return [1, "worn"];
        case "modular":
            return [1, null];
        case "drop":
            return [0, "dropped"];
        case "tower-shield": {
            const cost = action === "take-cover" ? 1 : 0;
            return [cost, null];
        }
        default:
            return [1, null];
    }
}
function getAnnotationLabel(annotation, hands) {
    if (!annotation)
        return null;
    const fullAnnotation = ["draw", "pick-up", "retrieve"].includes(annotation)
        ? `${annotation}${hands}H`
        : ["grip", "sheathe", "modular", "drop"].includes(annotation)
            ? annotation
            : null;
    return fullAnnotation ? game.pf2e.system.sluggify(fullAnnotation, { camel: "bactrian" }) : null;
}
async function changeCarryType(actor, item, handsHeld, annotation, action = "interact") {
    const [actionCost, carryType] = getCarryTypeActionData(item, annotation, action);
    if (!carryType)
        return;
    await actor.changeCarryType(item, { carryType, handsHeld });
    if (!game.combat)
        return;
    const templates = {
        flavor: "./systems/pf2e/templates/chat/action/flavor.hbs",
        content: "./systems/pf2e/templates/chat/action/content.hbs",
    };
    const sluggify = game.pf2e.system.sluggify;
    const actionKey = sluggify(action, { camel: "bactrian" });
    const annotationKey = annotation ? sluggify(annotation, { camel: "bactrian" }) : null;
    const fullAnnotationKey = getAnnotationLabel(annotation, handsHeld);
    const flavorAction = {
        title: `PF2E.Actions.${actionKey}.Title`,
        subtitle: fullAnnotationKey ? `PF2E.Actions.${actionKey}.${fullAnnotationKey}.Title` : null,
        glyph: getActionGlyph(actionCost),
    };
    const [traits, message] = action === "raise-a-shield"
        ? [[], `PF2E.Actions.${actionKey}.Content`]
        : ["take-cover", "end-cover"].includes(action)
            ? [[], `PF2E.Actions.${actionKey}.${annotationKey}.Description`]
            : [
                [traitSlugToObject("manipulate", CONFIG.PF2E.actionTraits)],
                `PF2E.Actions.${actionKey}.${fullAnnotationKey}.Description`,
            ];
    const flavor = await renderTemplate(templates.flavor, { action: flavorAction, traits });
    const content = await renderTemplate(templates.content, {
        imgPath: item.img,
        message: game.i18n.format(message, {
            actor: actor.name,
            weapon: item.name,
            // shield: item.shield?.name ?? item.name,
            // damageType: game.i18n.localize(`PF2E.Damage.RollFlavor.${selection}`),
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
function getActionAnnotation(item) {
    if (item.isEquipped)
        return;
    return item.carryType === "dropped" ? "pick-up" : item.isStowed ? "retrieve" : "draw";
}
function isOwnedItem(item) {
    return !!item?.actor;
}
function* actorItems(actor, type) {
    const types = Array.isArray(type)
        ? type
        : typeof type === "string"
            ? [type]
            : R.keys(CONFIG.PF2E.Item.documentClasses);
    for (const type of types) {
        if (EXCLUDED_TYPES.includes(type))
            continue;
        for (const item of actor.itemTypes[type]) {
            yield item;
        }
    }
}
function hasItemWithSourceId(actor, uuid, type) {
    const uuids = Array.isArray(uuid) ? uuid : [uuid];
    for (const item of actorItems(actor, type)) {
        const sourceId = item.sourceId;
        if (sourceId && uuids.includes(sourceId))
            return true;
    }
    return false;
}
function getItemWithSourceId(actor, uuid, type) {
    for (const item of actorItems(actor, type)) {
        const sourceId = item.sourceId;
        if (sourceId && uuid.includes(sourceId))
            return item;
    }
    return null;
}
function getChoiceSetSelection(item, { option, flag } = {}) {
    const rules = item._source.system.rules;
    const rule = rules.find((rule) => rule.key === "ChoiceSet" &&
        (!option || rule.rollOption === option) &&
        (!flag || rule.flag === flag));
    return rule?.selection;
}
async function getItemSource(uuid, instance) {
    const item = await fromUuid(uuid);
    return item instanceof Item && (!instance || isInstanceOf(item, instance))
        ? item.toObject()
        : null;
}
function getItemTypeLabel(type) {
    return game.i18n.localize(`TYPES.Item.${type}`);
}
export { actorItems, BANDS_OF_FORCE_SLUGS, changeCarryType, getActionAnnotation, getChoiceSetSelection, getEquippedHandwraps, getItemSource, getItemTypeLabel, getItemWithSourceId, HANDWRAPS_SLUG, hasItemWithSourceId, isOwnedItem, };
