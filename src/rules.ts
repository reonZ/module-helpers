import {
    ActorPF2e,
    ChoiceSetSource,
    ConditionSource,
    EffectSource,
    ItemPF2e,
    ModifierAdjustment,
    RuleElementSource,
    RuleElementSynthetics,
} from "foundry-pf2e";
import { R, RollNotePF2e } from ".";

/**
 * https://github.com/foundryvtt/pf2e/blob/360c60f68dad3cee456f328e48043283939582ec/src/module/rules/helpers.ts#L41
 */
function extractModifierAdjustments(
    adjustmentsRecord: RuleElementSynthetics["modifierAdjustments"],
    selectors: string[],
    slug: string
): ModifierAdjustment[] {
    const adjustments = R.unique(selectors.flatMap((s) => adjustmentsRecord[s] ?? []));
    return adjustments.filter((a) => [slug, null].includes(a.slug));
}

/**
 * https://github.com/foundryvtt/pf2e/blob/5a1089c6aa4725c2e73f60d67a3be01115896592/src/module/rules/helpers.ts#L88
 */
async function extractEphemeralEffects({
    affects,
    origin,
    target,
    item,
    domains,
    options,
}: ExtractEphemeralEffectsParams): Promise<(ConditionSource | EffectSource)[]> {
    if (!(origin && target)) return [];

    const [effectsFrom, effectsTo] = affects === "target" ? [origin, target] : [target, origin];
    const fullOptions = [
        ...options,
        effectsFrom.getRollOptions(domains),
        effectsTo.getSelfRollOptions(affects),
    ].flat();
    const resolvables = item ? (item.isOfType("spell") ? { spell: item } : { weapon: item }) : {};
    return (
        await Promise.all(
            domains
                .flatMap((s) => effectsFrom.synthetics.ephemeralEffects[s]?.[affects] ?? [])
                .map((d) => d({ test: fullOptions, resolvables }))
        )
    )
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

/**
 * https://github.com/foundryvtt/pf2e/blob/5967df95d2645162d06d6ee317e99cf9aa03477e/src/module/rules/helpers.ts#L60
 */
function extractNotes(
    rollNotes: Record<string, RollNotePF2e[]>,
    selectors: string[]
): RollNotePF2e[] {
    return selectors.flatMap((s) => (rollNotes[s] ?? []).map((n) => n.clone()));
}

function getChoiceSetSelection<T extends any = string>(
    item: ItemPF2e,
    { option, flag }: { option?: string; flag?: string } = {}
) {
    const rules = item._source.system.rules as RuleElementSource[];
    const rule = rules.find((rule: ChoiceSetSource): rule is ChoiceSetSource => {
        return (
            rule.key === "ChoiceSet" &&
            (!option || rule.rollOption === option) &&
            (!flag || rule.flag === flag)
        );
    });
    return rule?.selection as T | undefined;
}

interface ExtractEphemeralEffectsParams {
    affects: "target" | "origin";
    origin: ActorPF2e | null;
    target: ActorPF2e | null;
    item: ItemPF2e | null;
    domains: string[];
    options: Set<string> | string[];
}

export { extractEphemeralEffects, extractModifierAdjustments, extractNotes, getChoiceSetSelection };
