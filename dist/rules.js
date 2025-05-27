import { R } from ".";
/**
 * https://github.com/foundryvtt/pf2e/blob/360c60f68dad3cee456f328e48043283939582ec/src/module/rules/helpers.ts#L41
 */
function extractModifierAdjustments(adjustmentsRecord, selectors, slug) {
    const adjustments = R.unique(selectors.flatMap((s) => adjustmentsRecord[s] ?? []));
    return adjustments.filter((a) => [slug, null].includes(a.slug));
}
/**
 * https://github.com/foundryvtt/pf2e/blob/5a1089c6aa4725c2e73f60d67a3be01115896592/src/module/rules/helpers.ts#L88
 */
async function extractEphemeralEffects({ affects, origin, target, item, domains, options, }) {
    if (!(origin && target))
        return [];
    const [effectsFrom, effectsTo] = affects === "target" ? [origin, target] : [target, origin];
    const fullOptions = [
        ...options,
        effectsFrom.getRollOptions(domains),
        effectsTo.getSelfRollOptions(affects),
    ].flat();
    const resolvables = item ? (item.isOfType("spell") ? { spell: item } : { weapon: item }) : {};
    return (await Promise.all(domains
        .flatMap((s) => effectsFrom.synthetics.ephemeralEffects[s]?.[affects] ?? [])
        .map((d) => d({ test: fullOptions, resolvables }))))
        .filter(R.isNonNull)
        .map((effect) => {
        effect.system.context = {
            origin: {
                actor: effectsFrom.uuid,
                token: null,
                item: null,
                spellcasting: null,
            },
            target: { actor: effectsTo.uuid, token: null },
            roll: null,
        };
        if (effect.type === "effect") {
            effect.system.duration = {
                value: -1,
                unit: "unlimited",
                expiry: null,
                sustained: false,
            };
        }
        return effect;
    });
}
function getChoiceSetSelection(item, { option, flag } = {}) {
    const rules = item._source.system.rules;
    const rule = rules.find((rule) => {
        return (rule.key === "ChoiceSet" &&
            (!option || rule.rollOption === option) &&
            (!flag || rule.flag === flag));
    });
    return rule?.selection;
}
export { extractEphemeralEffects, extractModifierAdjustments, getChoiceSetSelection };
