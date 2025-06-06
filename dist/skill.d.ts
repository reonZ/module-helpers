import { SkillSlug } from "foundry-pf2e";
declare function getTranslatedSkills(lowercase?: boolean): Record<"athletics" | "deception" | "stealth" | "nature" | "acrobatics" | "arcana" | "crafting" | "diplomacy" | "intimidation" | "medicine" | "occultism" | "performance" | "religion" | "society" | "survival" | "thievery", string>;
declare function getSkillLabel(skill: SkillSlug, localize?: boolean): string;
export { getSkillLabel, getTranslatedSkills };
