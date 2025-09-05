import { AbstractEffectPF2e, ActorPF2e, ConditionSlug, ConditionSource, DamageType, DurationData, EffectSource, RuleElementSource } from "foundry-pf2e";
declare function createCustomPersistentDamage(options: CustomPersistentDamageOptions): PreCreate<EffectSource | ConditionSource> | undefined;
declare function createPersistentDamageSource(formula: string, damageType: DamageType, dc?: number): SourceFromSchema<foundry.documents.ItemSchema<"condition", import("foundry-pf2e/pf2e/module/item/condition/data.js").ConditionSystemSource>> & {
    flags: import("foundry-pf2e/pf2e/module/item/base/data/system.js").ItemSourceFlagsPF2e;
} & {
    _id: string;
} & {
    system: {
        persistent: {
            formula: string;
            damageType: "fire" | "force" | "poison" | "mental" | "spirit" | "vitality" | "void" | "acid" | "cold" | "electricity" | "sonic" | "bleed" | "bludgeoning" | "piercing" | "slashing" | "untyped";
            dc: number;
        };
    };
};
declare function createConditionSource(slug: ConditionSlug, counter?: number): PreCreate<ConditionSource> | undefined;
declare function createCustomCondition(options: CustomConditionOptions): PreCreate<EffectSource> | undefined;
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
    effect: AbstractEffectPF2e;
    description: string;
    remaining: string | null;
}
export { createConditionSource, createCustomCondition, createCustomEffect, createCustomPersistentDamage, createPersistentDamageSource, };
export type { CustomConditionOptions, CustomEffectDuration, CustomEffectOptions, EffectsPanelViewData, };
