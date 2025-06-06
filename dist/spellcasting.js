import { R } from ".";
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
function getHighestSpellcastingStatistic(actor) {
    const entries = actor.spellcasting?.spellcastingFeatures;
    if (!entries?.length)
        return;
    const classAttribute = actor.isOfType("character") ? actor.classDC?.attribute : null;
    const groupedEntries = R.groupBy(entries, (entry) => entry.statistic.mod);
    const highestMod = R.pipe(groupedEntries, R.keys(), R.sortBy([(x) => Number(x), "desc"]), R.first());
    const highestResults = groupedEntries[Number(highestMod)].map((entry) => ({
        tradition: entry.tradition,
        statistic: entry.statistic,
    }));
    if (highestResults.length === 1 || !classAttribute) {
        return highestResults[0];
    }
    return (highestResults.find((entry) => entry.statistic.attribute === classAttribute) ||
        highestResults[0]);
}
function getHighestSyntheticStatistic(actor, withClassDcs = true) {
    const isCharacter = actor.isOfType("character");
    const synthetics = Array.from(actor.synthetics.statistics.values());
    const statistics = withClassDcs && isCharacter
        ? [...synthetics, ...Object.values(actor.classDCs)]
        : synthetics;
    if (!statistics.length)
        return;
    const classStatistic = isCharacter ? actor.classDC : null;
    const groupedStatistics = R.groupBy(statistics, R.prop("mod"));
    const highestMod = R.pipe(R.keys(groupedStatistics), R.firstBy([R.identity(), "desc"]));
    if (classStatistic && highestMod && classStatistic.mod === highestMod) {
        return classStatistic;
    }
    return groupedStatistics[highestMod][0];
}
function createSpellcastingWithHighestStatisticSource(actor, { name, category, flags, showSlotlessRanks, sort, withClassDcs, }) {
    const highestEntry = getHighestSpellcastingStatistic(actor);
    const highestSynthetic = getHighestSyntheticStatistic(actor, withClassDcs);
    const [tradition, statistic] = highestEntry && (!highestSynthetic || highestEntry.statistic.mod >= highestSynthetic.mod)
        ? [highestEntry.tradition, highestEntry.statistic]
        : highestSynthetic
            ? [null, highestSynthetic]
            : [null, null];
    if (!statistic)
        return;
    return createSpellcastingSource({
        name,
        sort,
        flags,
        category,
        showSlotlessRanks,
        tradition: tradition ?? "arcane",
        attribute: statistic.attribute,
        proficiencyRank: statistic.rank ?? 1,
        proficiencySlug: statistic === highestSynthetic ? statistic.slug : undefined,
    });
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
export { createSpellcastingSource, createSpellcastingWithHighestStatisticSource, getSpellcastingMaxRank, };
