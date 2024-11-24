import { AttributeString, SkillSlug } from "foundry-pf2e";

export {};

declare global {
    type SkillsConfigSf2e = Record<SkillSlugSfe2, { label: string; attribute: AttributeString }>;

    type SkillSlugSfe2 = SkillSlug | "computers" | "piloting";
}
