function createSpellcastingSource({ name, category, attribute, flags, proficiencyRank, proficiencySlug, showSlotlessRanks, sort, tradition, }) {
    return {
        type: "spellcastingEntry",
        name,
        sort: sort ?? 0,
        system: {
            ability: {
                value: (!proficiencySlug && attribute) || "",
            },
            prepared: {
                value: category ?? "innate",
            },
            showSlotlessLevels: {
                value: showSlotlessRanks ?? false,
            },
            proficiency: {
                value: proficiencyRank ?? 1,
                slug: proficiencySlug ?? "",
            },
            tradition: {
                value: tradition ?? "arcane",
            },
        },
        flags: flags ?? {},
    };
}
function getSpellcastingMaxRank(entry, rankLimit = 10) {
    const slots = entry.system.slots;
    const limit = Math.clamp(rankLimit, 1, 10);
    let maxRank = 0;
    for (let rank = 1; rank <= limit; rank++) {
        const slotKey = `slot${rank}`;
        const slot = slots[slotKey];
        if (slot.max > 0) {
            maxRank = rank;
        }
    }
    return maxRank;
}
export { createSpellcastingSource, getSpellcastingMaxRank };
