import { AbstractEffectPF2e, ActorPF2e, ConditionSlug, ConditionSource, DamageType, DurationData, EffectSource, RuleElementSource } from "foundry-pf2e";
declare function createCustomPersistentDamage(options: CustomPersistentDamageOptions): PreCreate<EffectSource | ConditionSource> | undefined;
declare function createCustomCondition(options: CustomConditionOptions): PreCreate<EffectSource | ConditionSource> | undefined;
declare function createCustomEffect({ duration, img, name, rules, slug, unidentified, }: CustomEffectOptions): PreCreate<EffectSource>;
type CustomPersistentDamageOptions = Omit<WithPartial<CustomEffectOptions, "name" | "img">, "slug"> & {
    die: string;
    type: DamageType;
    dc: number;
};
type CustomConditionOptions = Omit<WithPartial<CustomEffectOptions, "img" | "name">, "rules" | "slug"> & {
    slug: ConditionSlug;
    counter?: number;
    alterations?: Record<string, JSONValue>[];
};
type CustomEffectDuration = DurationData & {
    origin?: TargetDocuments;
};
type CustomEffectOptions = {
    duration?: CustomEffectDuration;
    img: ImageFilePath;
    name: string;
    rules?: RuleElementSource[];
    slug?: string;
    unidentified?: boolean;
};
interface EffectsPanelViewData {
    afflictions: EffectViewData[];
    conditions: EffectViewData[];
    effects: EffectViewData[];
    actor: ActorPF2e | null;
    user: {
        isGM: boolean;
    };
}
interface EffectViewData {
    effect: AbstractEffectPF2e<ActorPF2e>;
    description: string;
    remaining: string | null;
}
export { createCustomCondition, createCustomEffect, createCustomPersistentDamage };
export type { CustomConditionOptions, CustomEffectDuration, CustomEffectOptions, EffectsPanelViewData, };
