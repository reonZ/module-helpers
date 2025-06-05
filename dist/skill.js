function getSkillLabel(skill, localize = true) {
    const label = CONFIG.PF2E.skills[skill].label;
    return localize ? game.i18n.localize(label) : label;
}
export { getSkillLabel };
