import { R } from ".";
let TRANSLATED_SKILL;
let TRANSLATED_SKILL_LOWER;
function getTranslatedSkills(lowercase = false) {
    TRANSLATED_SKILL ??= R.mapValues(CONFIG.PF2E.skills, ({ label }) => game.i18n.localize(label));
    if (lowercase) {
        TRANSLATED_SKILL_LOWER ??= R.mapValues(TRANSLATED_SKILL, (value) => value.toLocaleLowerCase(game.i18n.lang));
        return foundry.utils.deepClone(TRANSLATED_SKILL_LOWER);
    }
    return foundry.utils.deepClone(TRANSLATED_SKILL);
}
function getSkillLabel(skill, localize = true) {
    const label = CONFIG.PF2E.skills[skill].label;
    return localize ? game.i18n.localize(label) : label;
}
export { getSkillLabel, getTranslatedSkills };
