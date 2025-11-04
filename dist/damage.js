import { getDamageRollClass, R } from ".";
async function rollDamageFromFormula(formula, { actionName, extraRollOptions = [], item, notes = [], origin, skipDialog = false, target, toolbelt, }) {
    const { actor, token } = origin ?? {};
    const traits = R.filter(item?.system.traits.value ?? [], (trait) => trait in CONFIG.PF2E.actionTraits);
    const options = R.pipe([traits, actor?.getRollOptions(), item?.getRollOptions("item"), extraRollOptions], R.flat(), R.filter(R.isTruthy));
    const targetToken = target
        ? target.token ?? target.actor.token ?? target.actor.getActiveTokens().shift()?.document
        : undefined;
    const context = {
        type: "damage-roll",
        sourceType: "attack",
        actor: actor?.id ?? null,
        token: token?.id ?? null,
        target: target ? { actor: target.actor.uuid, token: targetToken?.uuid } : null,
        domains: [],
        options,
        mapIncreases: undefined,
        notes,
        secret: false,
        rollMode: "roll",
        traits,
        skipDialog,
        outcome: null,
        unadjustedOutcome: null,
    };
    const traitDescriptions = CONFIG.PF2E.traitsDescriptions;
    const flags = {
        core: {},
        pf2e: {
            context,
            origin: item?.getOriginData(),
        },
    };
    if (targetToken || toolbelt) {
        const toolbeltFlag = toolbelt ?? {};
        if (targetToken) {
            toolbeltFlag.targets = [targetToken.uuid];
        }
        flags["pf2e-toolbelt"] = {
            targetHelper: toolbeltFlag,
        };
    }
    actionName ??= item?.name ?? game.i18n.localize("PF2E.DamageRoll");
    let flavor = `<h4 class="action"><strong>${actionName}</strong></h4>`;
    flavor += `<div class="tags" data-tooltip-class="pf2e">`;
    flavor += R.pipe(traits, R.map((tag) => {
        const label = game.i18n.localize(CONFIG.PF2E.actionTraits[tag]);
        const tooltip = traitDescriptions[tag];
        return `<span class="tag" data-trait="${tag}" data-tooltip="${tooltip}">${label}</span>`;
    }), R.join(""));
    flavor += `</div><hr>`;
    if (notes.length) {
        flavor += `<ul class="notes">`;
        flavor += R.pipe(notes, R.map((note) => {
            let content = "";
            if (note.title?.trim()) {
                content += `<strong>${note.title}</strong> `;
            }
            content += note.text;
            return `<li class="roll-note">${content}</li>`;
        }));
        flavor += `</ul>`;
    }
    const DamageRoll = getDamageRollClass();
    const roll = await new DamageRoll(formula, { actor, item }).evaluate();
    const speaker = getDocumentClass("ChatMessage").getSpeaker({ actor, token });
    return roll.toMessage({
        flavor,
        speaker,
        flags,
    });
}
export { rollDamageFromFormula };
