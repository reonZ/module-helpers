import { AbstractEffectPF2e, ActorPF2e, AfflictionPF2e, ConditionPF2e, DurationData, EffectExpiryType, EffectPF2e } from "foundry-pf2e";
declare function calculateRemainingDuration(effect: AbstractEffectPF2e, durationData: DurationData | {
    unit: "unlimited";
}, fightyActor?: ActorPF2e | null): {
    expired: boolean;
    remaining: number;
};
declare function getRemainingDurationLabel(remaining: number, initiative: number, expiry: EffectExpiryType | null): string;
declare function getEnrichedDescriptions(effects: AfflictionPF2e[] | EffectPF2e[] | ConditionPF2e[]): Promise<string[]>;
export { calculateRemainingDuration, getEnrichedDescriptions, getRemainingDurationLabel };
