import {
    AbilityItemPF2e,
    ActionCost,
    ActorPF2e,
    ChatMessageFlagsPF2e,
    ChatMessagePF2e,
    EffectSource,
    FeatPF2e,
} from "foundry-pf2e";
import { eventToRollMode, traitSlugToObject } from ".";

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

    const value =
        typeof action !== "object" ? action : action.type === "action" ? action.value : action.type;
    const sanitized = String(value ?? "")
        .toLowerCase()
        .trim();

    return actionGlyphMap[sanitized]?.replace("-", "–") ?? "";
}

/**
 * https://github.com/foundryvtt/pf2e/blob/37b0dcab08141b3e9e4e0f44e51df9f4dfd52a71/src/util/misc.ts#L173
 */
function getActionIcon(
    actionType: string | ActionCost | null,
    fallback: ImageFilePath
): ImageFilePath;
function getActionIcon(
    actionType: string | ActionCost | null,
    fallback: ImageFilePath | null
): ImageFilePath | null;
function getActionIcon(actionType: string | ActionCost | null): ImageFilePath;
function getActionIcon(
    action: string | ActionCost | null,
    fallback: ImageFilePath | null = "systems/pf2e/icons/actions/Empty.webp"
): ImageFilePath | null {
    if (action === null) return actionImgMap.passive;
    const value =
        typeof action !== "object" ? action : action.type === "action" ? action.value : action.type;
    const sanitized = String(value ?? "")
        .toLowerCase()
        .trim();
    return actionImgMap[sanitized] ?? fallback;
}

function isDefaultActionIcon(img: string, action: string | ActionCost | null) {
    return img === getActionIcon(action);
}

async function updateActionFrequency<T extends AbilityItemPF2e | FeatPF2e>(
    action: T
): Promise<T | undefined> {
    if (action.system.frequency && action.system.frequency.value > 0) {
        const newValue = action.system.frequency.value - 1;
        return action.update({ "system.frequency.value": newValue }) as Promise<T | undefined>;
    }
}

async function useAction(item: AbilityItemPF2e<ActorPF2e> | FeatPF2e<ActorPF2e>, event?: Event) {
    const hasSelfEffect = item.system.selfEffect;
    const selfApply = hasSelfEffect && game.toolbelt?.getToolSetting("actionable", "apply");
    const macro = await game.toolbelt?.api.actionable.getActionMacro(item);

    if (!selfApply && !macro) {
        return game.pf2e.rollItemMacro(item.uuid, event);
    }

    await updateActionFrequency(item);

    if (hasSelfEffect) {
        useSelfAppliedAction(item, eventToRollMode(event));
    } else {
        macro?.execute({ actor: item.actor, item });
    }
}

/**
 * converted version of
 * https://github.com/foundryvtt/pf2e/blob/07c666035850e084835e0c8c3ca365b06dcd0a75/src/module/chat-message/helpers.ts#L16
 * https://github.com/foundryvtt/pf2e/blob/98ee106cc8faf8ebbcbbb7b612b3b267645ef91e/src/module/apps/sidebar/chat-log.ts#L121
 */
async function useSelfAppliedAction(
    item: AbilityItemPF2e<ActorPF2e> | FeatPF2e<ActorPF2e>,
    rollMode: RollMode | "roll" = "roll"
) {
    const effect = item.system.selfEffect ? await fromUuid(item.system.selfEffect.uuid) : undefined;
    if (!effect) return;

    const { actor, actionCost } = item;
    const token = actor.getActiveTokens(true, true).shift() ?? null;
    const traits =
        item.system.traits.value?.filter(
            (t) => t in CONFIG.PF2E.Item.documentClasses.effect.validTraits
        ) ?? [];

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

    // create the already applied message

    const ChatMessagePF2eCls = getDocumentClass("ChatMessage");
    const speaker = ChatMessagePF2eCls.getSpeaker({ actor, token });
    const flavor = await foundry.applications.handlebars.renderTemplate(
        "systems/pf2e/templates/chat/action/flavor.hbs",
        {
            action: { title: item.name, glyph: getActionGlyph(actionCost) },
            item,
            traits: item.system.traits.value.map((t) =>
                traitSlugToObject(t, CONFIG.PF2E.actionTraits)
            ),
        }
    );

    const previewLength = 100;
    const descriptionPreview = ((): string | null => {
        if (item.actor.pack) return null;
        const tempDiv = document.createElement("div");
        const documentTypes = [...CONST.DOCUMENT_LINK_TYPES, "Compendium", "UUID"];
        const linkPattern = new RegExp(
            `@(${documentTypes.join("|")})\\[([^#\\]]+)(?:#([^\\]]+))?](?:{([^}]+)})?`,
            "g"
        );
        tempDiv.innerHTML = item.description.replace(linkPattern, (_match, ...args) => args[3]);

        return tempDiv.innerText.slice(0, previewLength);
    })();

    const content = await foundry.applications.handlebars.renderTemplate(
        "systems/pf2e/templates/chat/action/collapsed.hbs",
        {
            actor: item.actor,
            description: {
                full:
                    descriptionPreview && descriptionPreview.length < previewLength
                        ? item.description
                        : null,
                preview: descriptionPreview,
            },
        }
    );

    const flags: { pf2e: ChatMessageFlagsPF2e["pf2e"] } = {
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

    const messageData = ChatMessagePF2eCls.applyRollMode(
        { speaker, flavor, content: content + effectSection, flags },
        rollMode
    ) as ChatMessageCreateData<ChatMessagePF2e>;
    return (await ChatMessagePF2eCls.create(messageData)) ?? null;
}

export { getActionGlyph, getActionIcon, isDefaultActionIcon, updateActionFrequency, useAction };
