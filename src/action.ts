import { AbilityItemPF2e, ActionCost, ActorPF2e, EffectSource, FeatPF2e } from "foundry-pf2e";

/**
 * https://github.com/foundryvtt/pf2e/blob/89892b6fafec1456a0358de8c6d7b102e3fe2da2/src/util/misc.ts#L188C1-L199C3
 */
const actionGlyphMap: Record<string, string> = {
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
const actionImgMap: Record<string, ImageFilePath> = {
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
function getActionGlyph(action: string | number | null | ActionCost): string {
    if (!action && action !== 0) return "";

    const value = typeof action !== "object" ? action : action.type === "action" ? action.value : action.type;
    const sanitized = String(value ?? "")
        .toLowerCase()
        .trim();

    return actionGlyphMap[sanitized]?.replace("-", "–") ?? "";
}

/**
 * https://github.com/foundryvtt/pf2e/blob/37b0dcab08141b3e9e4e0f44e51df9f4dfd52a71/src/util/misc.ts#L173
 */
function getActionIcon(action: ActionIconType, fallback: ImageFilePath): ImageFilePath;
function getActionIcon(action: ActionIconType, fallback: ImageFilePath | null): ImageFilePath | null;
function getActionIcon(action: ActionIconType): ImageFilePath;
function getActionIcon(
    action: ActionIconType,
    fallback: ImageFilePath | null = "systems/pf2e/icons/actions/Empty.webp",
): ImageFilePath | null {
    if (action === null) return actionImgMap.passive;
    const value = typeof action !== "object" ? action : action.type === "action" ? action.value : action.type;
    const sanitized = String(value ?? "")
        .toLowerCase()
        .trim();
    return actionImgMap[sanitized] ?? fallback;
}

function isDefaultActionIcon(img: string, action: string | ActionCost | null) {
    return img === getActionIcon(action);
}

async function useAction(event: Event, item: AbilityItemPF2e<ActorPF2e> | FeatPF2e<ActorPF2e>) {
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
            const msg = game.toolbelt!.localize("actionable.action.cancel", item);
            return ui.notifications.warn(msg, { localize: false });
        },
    });
}

async function applySelfEffect(item: AbilityItemPF2e<ActorPF2e> | FeatPF2e<ActorPF2e>) {
    const effect = item.system.selfEffect && (await fromUuid(item.system.selfEffect.uuid));
    if (!effect) return;

    const actor = item.actor;
    const token = actor.getActiveTokens(true, true).shift() ?? null;
    const traits = item.system.traits.value?.filter(
        (trait) => trait in CONFIG.PF2E.Item.documentClasses.effect.validTraits,
    );

    const effectSource: EffectSource = foundry.utils.mergeObject(effect.toObject(), {
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

type ActionIconType = string | number | ActionCost | null;

export { applySelfEffect, getActionGlyph, getActionIcon, isDefaultActionIcon, useAction };
