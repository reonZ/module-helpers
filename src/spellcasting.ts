import {
    AttributeString,
    MagicTradition,
    OneToTen,
    SlotKey,
    SpellcastingCategory,
    SpellcastingEntryPF2e,
    SpellcastingEntrySource,
    SpellcastingEntrySystemSource,
    ZeroToFour,
    ZeroToTen,
} from "foundry-pf2e";

function createSpellcastingSource({
    name,
    category,
    attribute,
    flags,
    proficiencyRank,
    proficiencySlug,
    showSlotlessRanks,
    sort,
    tradition,
}: CreateSpellcastingSource): CreatedSpellcastingEntrySource {
    return {
        type: "spellcastingEntry",
        name,
        sort: sort ?? 0,
        system: {
            ability: {
                value: (!proficiencySlug && attribute) || "",
            },
            prepared: {
                value: (category as SpellcastingCategory) ?? "innate",
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

function getSpellcastingMaxRank(entry: SpellcastingEntryPF2e, rankLimit: OneToTen = 10) {
    const slots = entry.system.slots;
    const limit = Math.clamp(rankLimit, 1, 10) as OneToTen;

    let maxRank = 0;

    for (let rank = 1; rank <= limit; rank++) {
        const slotKey = `slot${rank}` as SlotKey;
        const slot = slots[slotKey];

        if (slot.max > 0) {
            maxRank = rank;
        }
    }

    return maxRank as ZeroToTen;
}

type CreatedSpellcastingEntrySource = Omit<PreCreate<SpellcastingEntrySource>, "system"> & {
    system: DeepPartial<SpellcastingEntrySystemSource>;
};

type CreateSpellcastingSource = {
    name: string;
    category?: SpellcastingCategory | "charges";
    sort?: number;
    attribute?: AttributeString | null;
    proficiencySlug?: string;
    showSlotlessRanks?: boolean;
    proficiencyRank?: ZeroToFour | null;
    tradition?: MagicTradition;
    flags?: Record<string, any>;
};

export { createSpellcastingSource, getSpellcastingMaxRank };
export type { CreateSpellcastingSource };
