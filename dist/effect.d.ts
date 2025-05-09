import { ConditionSource, DurationData, EffectSource, RuleElementSource } from "foundry-pf2e";
declare function createCustomCondition(options: CustomConditionOptions): PreCreate<EffectSource | ConditionSource> | undefined;
declare function createCustomEffect({ duration, img, name, origin, rules, slug, unidentified, }: CustomEffectOptions): PreCreate<EffectSource>;
type CustomConditionOptions = Omit<WithPartial<CustomEffectOptions, "img" | "name">, "rules"> & {
    slug: string;
    counter?: number;
};
type CustomEffectOptions = {
    duration?: DurationData;
    img: ImageFilePath;
    name: string;
    origin?: TargetDocuments;
    rules?: RuleElementSource[];
    slug?: string;
    unidentified?: boolean;
};
export { createCustomCondition, createCustomEffect };
export type { CustomConditionOptions, CustomEffectOptions };
