import { eventToRollMode, traitSlugToObject } from ".";
/**
 * https://github.com/foundryvtt/pf2e/blob/89892b6fafec1456a0358de8c6d7b102e3fe2da2/src/util/misc.ts#L188C1-L199C3
 */
const actionGlyphMap = {
    0: "F",
    free: "F",
    1: "1",
    2: "2",
    3: "3",
    "1 or 2": "1/2",
    "1 to 3": "1 - 3",
    "2 or 3": "2/3",
    "2 rounds": "3,3",
    reaction: "R",
};
/**
 * https://github.com/foundryvtt/pf2e/blob/37b0dcab08141b3e9e4e0f44e51df9f4dfd52a71/src/util/misc.ts#L160C1-L171C3
 */
const actionImgMap = {
    0: "systems/pf2e/icons/actions/FreeAction.webp",
    free: "systems/pf2e/icons/actions/FreeAction.webp",
    1: "systems/pf2e/icons/actions/OneAction.webp",
    2: "systems/pf2e/icons/actions/TwoActions.webp",
    3: "systems/pf2e/icons/actions/ThreeActions.webp",
    "1 or 2": "systems/pf2e/icons/actions/OneTwoActions.webp",
    "1 to 3": "systems/pf2e/icons/actions/OneThreeActions.webp",
    "2 or 3": "systems/pf2e/icons/actions/TwoThreeActions.webp",
    reaction: "systems/pf2e/icons/actions/Reaction.webp",
    passive: "systems/pf2e/icons/actions/Passive.webp",
};
/**
 * https://github.com/foundryvtt/pf2e/blob/89892b6fafec1456a0358de8c6d7b102e3fe2da2/src/util/misc.ts#L205
 */
function getActionGlyph(action) {
    if (!action && action !== 0)
        return "";
    const value = typeof action !== "object" ? action : action.type === "action" ? action.value : action.type;
    const sanitized = String(value ?? "")
        .toLowerCase()
        .trim();
    return actionGlyphMap[sanitized]?.replace("-", "–") ?? "";
}
function getActionIcon(action, fallback = "systems/pf2e/icons/actions/Empty.webp") {
    if (action === null)
        return actionImgMap.passive;
    const value = typeof action !== "object" ? action : action.type === "action" ? action.value : action.type;
    const sanitized = String(value ?? "")
        .toLowerCase()
        .trim();
    return actionImgMap[sanitized] ?? fallback;
}
function isDefaultActionIcon(img, action) {
    return img === getActionIcon(action);
}
async function updateActionFrequency(action) {
    if (action.system.frequency && action.system.frequency.value > 0) {
        const newValue = action.system.frequency.value - 1;
        return action.update({ "system.frequency.value": newValue });
    }
}
async function useAction(event, item) {
    const hasSelfEffect = item.system.selfEffect;
    const selfApply = hasSelfEffect && game.toolbelt?.getToolSetting("actionable", "apply");
    const macro = game.toolbelt?.getToolSetting("actionable", "action")
        ? await game.toolbelt?.api.actionable.getActionMacro(item)
        : undefined;
    if (!selfApply && !macro) {
        return game.pf2e.rollItemMacro(item.uuid, event);
    }
    if (hasSelfEffect) {
        await updateActionFrequency(item);
        return useSelfAppliedAction(item, event);
    }
    else {
        // we let the macro handle the action usage or cancelation
        macro?.execute({
            actor: item.actor,
            item,
            use: async () => {
                await updateActionFrequency(item);
                return game.pf2e.rollItemMacro(item.uuid, event);
            },
            cancel: () => {
                const msg = game.toolbelt.localize("actionable.action.cancel", item);
                return ui.notifications.warn(msg, { localize: false });
            },
        });
    }
}
/**
 * converted version of
 * https://github.com/foundryvtt/pf2e/blob/07c666035850e084835e0c8c3ca365b06dcd0a75/src/module/chat-message/helpers.ts#L16
 * https://github.com/foundryvtt/pf2e/blob/98ee106cc8faf8ebbcbbb7b612b3b267645ef91e/src/module/apps/sidebar/chat-log.ts#L121
 */
async function useSelfAppliedAction(item, rollMode, effect) {
    const isSpell = item.isOfType("spell");
    const isAction = item.isOfType("action", "feat");
    effect ??=
        isAction && item.system.selfEffect
            ? await fromUuid(item.system.selfEffect.uuid)
            : undefined;
    if (!effect)
        return;
    const actor = item.actor;
    const actionCost = isSpell ? item.actionGlyph : isAction ? item.actionCost : null;
    const token = actor.getActiveTokens(true, true).shift() ?? null;
    const traits = item.system.traits.value?.filter((t) => t in CONFIG.PF2E.Item.documentClasses.effect.validTraits) ?? [];
    const effectSource = foundry.utils.mergeObject(effect.toObject(), {
        _id: null,
        system: {
            context: {
                origin: {
                    actor: actor.uuid,
                    token: token?.uuid ?? null,
                    item: item.uuid,
                    spellcasting: null,
                    rollOptions: item.getOriginData().rollOptions,
                },
                target: {
                    actor: actor.uuid,
                    token: token?.uuid ?? null,
                },
                roll: null,
            },
            traits: { value: traits },
        },
    });
    await actor.createEmbeddedDocuments("Item", [effectSource]);
    // create the already applied message
    const ChatMessagePF2eCls = getDocumentClass("ChatMessage");
    const speaker = ChatMessagePF2eCls.getSpeaker({ actor, token });
    const flavor = await foundry.applications.handlebars.renderTemplate("systems/pf2e/templates/chat/action/flavor.hbs", {
        action: { title: item.name, glyph: getActionGlyph(actionCost) },
        item,
        traits: item.system.traits.value.map((t) => traitSlugToObject(t, CONFIG.PF2E.actionTraits)),
    });
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
    const content = await foundry.applications.handlebars.renderTemplate("systems/pf2e/templates/chat/action/collapsed.hbs", {
        actor: item.actor,
        description: {
            full: descriptionPreview && descriptionPreview.length < previewLength
                ? item.description
                : null,
            preview: descriptionPreview,
        },
        selfEffect: false,
    });
    const flags = {
        pf2e: {
            context: { type: "self-effect", item: item.id },
        },
    };
    const effectLink = game.i18n.format("PF2E.Item.Ability.SelfAppliedEffect.Applied", {
        effect: effect.toAnchor({ attrs: { draggable: "true" } }).outerHTML,
    });
    const effectSection = `<div class="message-buttons">
        <span class="effect-applied">${effectLink}</span>
    </div>`;
    const messageData = ChatMessagePF2eCls.applyRollMode({ speaker, flavor, content: content + effectSection, flags }, (rollMode instanceof Event ? eventToRollMode(rollMode) : rollMode) ?? "roll");
    return ChatMessagePF2eCls.create(messageData);
}
export { getActionGlyph, getActionIcon, isDefaultActionIcon, updateActionFrequency, useAction, useSelfAppliedAction, };
