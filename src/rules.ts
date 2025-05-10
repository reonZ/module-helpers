import {
    ChoiceSetSource,
    ItemPF2e,
    ModifierAdjustment,
    RuleElementSource,
    RuleElementSynthetics,
} from "foundry-pf2e";
import { R } from ".";

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

export { extractModifierAdjustments, getChoiceSetSelection };
