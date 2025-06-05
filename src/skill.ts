import { SkillSlug } from "foundry-pf2e";

function getSkillLabel(skill: SkillSlug, localize = true) {
    const label = CONFIG.PF2E.skills[skill].label;
    return localize ? game.i18n.localize(label) : label;
}

export { getSkillLabel };
