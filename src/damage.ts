import {
    AbilityTrait,
    ChatMessageFlagsPF2e,
    DamageDamageContextFlag,
    ItemPF2e,
} from "foundry-pf2e";
import * as R from "remeda";
import { getDamageRollClass } from "./classes";

async function rollDamageFromFormula(
    formula: string,
    {
        actionName,
        item,
        origin,
        target,
        extraRollOptions = [],
        skipDialog = false,
        toolbelt,
    }: RollDamageExtraOptions = {}
) {
    const { actor, token } = origin ?? {};
    const DamageRoll = getDamageRollClass();
    const roll = await new DamageRoll(formula, { actor, item }).evaluate();
    const traits = R.filter(
        item?.system.traits.value ?? [],
        (trait): trait is AbilityTrait => trait in CONFIG.PF2E.actionTraits
    );

    const options = R.pipe(
        [traits, actor?.getRollOptions(), item?.getRollOptions("item"), extraRollOptions],
        R.flat(),
        R.filter(R.isTruthy)
    );

    const targetToken = target
        ? target.token ?? target.actor.token ?? target.actor.getActiveTokens().shift()?.document
        : undefined;

    const context: DamageDamageContextFlag = {
        type: "damage-roll",
        sourceType: "attack",
        actor: actor?.id ?? null,
        token: token?.id ?? null,
        target: target ? { actor: target.actor.uuid, token: targetToken?.uuid } : null,
        domains: [],
        options,
        mapIncreases: undefined,
        notes: [],
        secret: false,
        rollMode: "roll",
        traits,
        skipDialog,
        outcome: null,
        unadjustedOutcome: null,
    };

    const traitDescriptions: Record<string, string | undefined> = CONFIG.PF2E.traitsDescriptions;

    const flags: ChatMessageFlagsPF2e = {
        core: {},
        pf2e: {
            context,
            origin: item?.getOriginData(),
        },
        ["pf2e-dailies"]: {
            targetHelper: {},
        },
    };

    if (targetToken || toolbelt) {
        const toolbeltFlag: toolbelt.targetHelper.MessageFlag = toolbelt ?? {};

        if (targetToken) {
            toolbeltFlag.targets = [targetToken.uuid];
        }

        flags["pf2e-toolbelt"] = {
            targetHelper: toolbeltFlag,
        };
    }

    actionName ??= item?.name ?? game.i18n.localize("PF2E.DamageRoll");

    let flavor = `<h4 class="action"><strong>${actionName}</strong></h4>`;
    flavor += '<div class="tags" data-tooltip-class="pf2e">';
    flavor += traits
        .map((tag) => {
            const label = game.i18n.localize(CONFIG.PF2E.actionTraits[tag]);
            const tooltip = traitDescriptions[tag];
            return `<span class="tag" data-trait="${tag}" data-tooltip="${tooltip}">${label}</span>`;
        })
        .join("");
    flavor += "</div><hr>";

    return roll.toMessage({
        flavor,
        speaker: getDocumentClass("ChatMessage").getSpeaker({ actor, token }),
        flags,
    });
}

type RollDamageExtraOptions = {
    item?: ItemPF2e;
    actionName?: string;
    origin?: TargetDocuments;
    target?: TargetDocuments;
    extraRollOptions?: string[];
    skipDialog?: boolean;
    toolbelt?: RollDamageToolbeltFlag;
};

type RollDamageToolbeltFlag = Pick<
    toolbelt.targetHelper.MessageFlag,
    "save" | "options" | "traits" | "item"
>;

export { rollDamageFromFormula };
export type { RollDamageExtraOptions, RollDamageToolbeltFlag };
