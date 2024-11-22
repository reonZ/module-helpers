const EFFECT_AREA_SHAPES = [
    "burst",
    "cone",
    "cube",
    "cylinder",
    "emanation",
    "line",
    "square",
];
const MAGIC_TRADITIONS = new Set(["arcane", "divine", "occult", "primal"]);
function spellSlotGroupIdToNumber(groupId) {
    if (groupId === "cantrips")
        return 0;
    const numericValue = Number(groupId ?? NaN);
    return numericValue.between(0, 10) ? numericValue : null;
}
export { EFFECT_AREA_SHAPES, MAGIC_TRADITIONS, spellSlotGroupIdToNumber };
