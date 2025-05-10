import { ItemPF2e, ModifierAdjustment, RuleElementSynthetics } from "foundry-pf2e";
/**
 * https://github.com/foundryvtt/pf2e/blob/360c60f68dad3cee456f328e48043283939582ec/src/module/rules/helpers.ts#L41
 */
declare function extractModifierAdjustments(adjustmentsRecord: RuleElementSynthetics["modifierAdjustments"], selectors: string[], slug: string): ModifierAdjustment[];
declare function getChoiceSetSelection<T extends any = string>(item: ItemPF2e, { option, flag }?: {
    option?: string;
    flag?: string;
}): T | undefined;
export { extractModifierAdjustments, getChoiceSetSelection };
