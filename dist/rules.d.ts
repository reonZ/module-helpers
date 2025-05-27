import { ActorPF2e, ConditionSource, EffectSource, ItemPF2e, ModifierAdjustment, RuleElementSynthetics } from "foundry-pf2e";
/**
 * https://github.com/foundryvtt/pf2e/blob/360c60f68dad3cee456f328e48043283939582ec/src/module/rules/helpers.ts#L41
 */
declare function extractModifierAdjustments(adjustmentsRecord: RuleElementSynthetics["modifierAdjustments"], selectors: string[], slug: string): ModifierAdjustment[];
/**
 * https://github.com/foundryvtt/pf2e/blob/5a1089c6aa4725c2e73f60d67a3be01115896592/src/module/rules/helpers.ts#L88
 */
declare function extractEphemeralEffects({ affects, origin, target, item, domains, options, }: ExtractEphemeralEffectsParams): Promise<(ConditionSource | EffectSource)[]>;
declare function getChoiceSetSelection<T extends any = string>(item: ItemPF2e, { option, flag }?: {
    option?: string;
    flag?: string;
}): T | undefined;
interface ExtractEphemeralEffectsParams {
    affects: "target" | "origin";
    origin: ActorPF2e | null;
    target: ActorPF2e | null;
    item: ItemPF2e | null;
    domains: string[];
    options: Set<string> | string[];
}
export { extractEphemeralEffects, extractModifierAdjustments, getChoiceSetSelection };
