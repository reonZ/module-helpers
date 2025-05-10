import { ConditionSlug, ConditionSource, DamageType, DurationData, EffectSource, RuleElementSource } from "foundry-pf2e";
declare function createCustomPersistentDamage(options: CustomPersistentDamageOptions): PreCreate<EffectSource | ConditionSource> | undefined;
declare function createCustomCondition(options: CustomConditionOptions): PreCreate<EffectSource | ConditionSource> | undefined;
declare function createCustomEffect({ duration, img, name, rules, slug, unidentified, }: CustomEffectOptions): PreCreate<EffectSource>;
type CustomPersistentDamageOptions = Omit<WithPartial<CustomEffectOptions, "name">, "slug" | "img"> & {
    die: string;
    type: DamageType;
    dc: number;
};
type CustomConditionOptions = Omit<WithPartial<CustomEffectOptions, "img" | "name">, "rules" | "slug"> & {
    slug: ConditionSlug;
    counter?: number;
    alterations?: Record<string, JSONValue>[];
};
type CustomEffectOptions = {
    duration?: DurationData & {
        origin?: TargetDocuments;
    };
    img: ImageFilePath;
    name: string;
    rules?: RuleElementSource[];
    slug?: string;
    unidentified?: boolean;
};
export { createCustomCondition, createCustomEffect, createCustomPersistentDamage };
export type { CustomConditionOptions, CustomEffectOptions };
