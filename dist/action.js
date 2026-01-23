import { R, SYSTEM } from ".";
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
const actionImgMap = R.mapValues({
    0: "icons/actions/FreeAction.webp",
    free: "icons/actions/FreeAction.webp",
    1: "icons/actions/OneAction.webp",
    2: "icons/actions/TwoActions.webp",
    3: "icons/actions/ThreeActions.webp",
    "1 or 2": "icons/actions/OneTwoActions.webp",
    "1 to 3": "icons/actions/OneThreeActions.webp",
    "2 or 3": "icons/actions/TwoThreeActions.webp",
    reaction: "icons/actions/Reaction.webp",
    passive: "icons/actions/Passive.webp",
}, (tail) => SYSTEM.path(tail));
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
function getActionIcon(action, fallback = SYSTEM.getPath("icons/actions/Empty.webp")) {
    if (action === null)
        return actionImgMap.passive();
    const value = typeof action !== "object" ? action : action.type === "action" ? action.value : action.type;
    const sanitized = String(value ?? "")
        .toLowerCase()
        .trim();
    return actionImgMap[sanitized]?.() ?? fallback;
}
function isDefaultActionIcon(img, action) {
    return img === getActionIcon(action);
}
async function useAction(event, item) {
    const macro = game.toolbelt?.getToolSetting("actionable", "action")
        ? await game.toolbelt?.api.actionable.getActionMacro(item)
        : undefined;
    const use = async () => {
        if (item.crafting) {
            return game.pf2e.rollItemMacro(item.uuid, event);
        }
        if (item.system.frequency && item.system.frequency.value > 0) {
            const newValue = item.system.frequency.value - 1;
            await item.update({ "system.frequency.value": newValue });
        }
        if (item.system.selfEffect) {
            await applySelfEffect(item);
        }
        return item.toMessage(event);
    };
    if (!macro) {
        return use();
    }
    // we let the macro handle the action usage or cancelation
    return macro.execute({
        actor: item.actor,
        item,
        use,
        cancel: () => {
            const msg = game.toolbelt.localize("actionable.action.cancel", item);
            return ui.notifications.warn(msg, { localize: false });
        },
    });
}
async function applySelfEffect(item) {
    const effect = item.system.selfEffect && (await fromUuid(item.system.selfEffect.uuid));
    if (!effect)
        return;
    const actor = item.actor;
    const token = actor.getActiveTokens(true, true).shift() ?? null;
    const traits = item.system.traits.value?.filter((trait) => trait in CONFIG.PF2E.Item.documentClasses.effect.validTraits);
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
}
export { applySelfEffect, getActionGlyph, getActionIcon, isDefaultActionIcon, useAction };
