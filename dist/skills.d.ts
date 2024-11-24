import { SkillSlug } from "foundry-pf2e";
declare function getTranslatedSkills(lowercase?: boolean): Record<"performance" | "athletics" | "deception" | "stealth" | "nature" | "acrobatics" | "arcana" | "crafting" | "diplomacy" | "intimidation" | "medicine" | "occultism" | "religion" | "society" | "survival" | "thievery", string>;
declare function getSkillLabel(skill: SkillSlug, localize?: boolean): string;
export { getSkillLabel, getTranslatedSkills };
