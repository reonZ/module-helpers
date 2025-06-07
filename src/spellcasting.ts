import {
    ActorPF2e,
    AttributeString,
    CharacterPF2e,
    CreaturePF2e,
    ItemSystemData,
    MagicTradition,
    NPCPF2e,
    OneToTen,
    SlotKey,
    SpellcastingCategory,
    SpellcastingEntry,
    SpellcastingEntryPF2e,
    SpellcastingEntrySource,
    SpellcastingEntrySystemSource,
    SpellcastingSheetData,
    SpellCollection,
    SpellPF2e,
    SpellSlotGroupId,
    Statistic,
    ValueAndMax,
    ZeroToFour,
    ZeroToTen,
} from "foundry-pf2e";
import { getSpellRankLabel, localizer, R } from ".";

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

function getHighestSpellcastingStatistic(actor: NPCPF2e | CharacterPF2e) {
    const entries = (actor as CreaturePF2e).spellcasting?.spellcastingFeatures;
    if (!entries?.length) return;

    const classAttribute = actor.isOfType("character") ? actor.classDC?.attribute : null;
    const groupedEntries = R.groupBy(entries, (entry) => entry.statistic.mod);

    const highestMod = R.pipe(
        groupedEntries,
        R.keys(),
        R.sortBy([(x) => Number(x), "desc"]),
        R.first()
    );

    const highestResults = groupedEntries[Number(highestMod)].map((entry) => ({
        tradition: entry.tradition,
        statistic: entry.statistic,
    }));

    if (highestResults.length === 1 || !classAttribute) {
        return highestResults[0];
    }

    return (
        highestResults.find((entry) => entry.statistic.attribute === classAttribute) ||
        highestResults[0]
    );
}

function getHighestSyntheticStatistic(actor: NPCPF2e | CharacterPF2e, withClassDcs = true) {
    const isCharacter = actor.isOfType("character");
    const synthetics = Array.from(actor.synthetics.statistics.values());
    const statistics =
        withClassDcs && isCharacter
            ? [...synthetics, ...Object.values(actor.classDCs)]
            : synthetics;

    if (!statistics.length) return;

    const classStatistic = isCharacter ? actor.classDC : null;
    const groupedStatistics = R.groupBy(statistics, R.prop("mod"));
    const highestMod = R.pipe(
        R.keys(groupedStatistics),
        R.firstBy([R.identity(), "desc"])
    ) as unknown as number;

    if (classStatistic && highestMod && classStatistic.mod === highestMod) {
        return classStatistic;
    }

    return groupedStatistics[highestMod][0];
}

function createSpellcastingWithHighestStatisticSource(
    actor: NPCPF2e | CharacterPF2e,
    {
        name,
        category,
        flags,
        showSlotlessRanks,
        sort,
        withClassDcs,
    }: CreateSpellcastingSourceWithHighestStatistic
) {
    const highestEntry = getHighestSpellcastingStatistic(actor);
    const highestSynthetic = getHighestSyntheticStatistic(actor, withClassDcs);

    const [tradition, statistic] =
        highestEntry && (!highestSynthetic || highestEntry.statistic.mod >= highestSynthetic.mod)
            ? [highestEntry.tradition, highestEntry.statistic]
            : highestSynthetic
            ? [null, highestSynthetic]
            : [null, null];

    if (!statistic) return;

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

/**
 * https://github.com/foundryvtt/pf2e/blob/49dc6d70c7e7bb26d8039c97361e638bdef6a3bd/src/module/item/spellcasting-entry/helpers.ts#L10
 */
function createCounteractStatistic<TActor extends CreaturePF2e>(
    ability: SpellcastingEntryWithCharges<TActor>
): Statistic<TActor> {
    const actor = ability.actor;

    // NPCs have neither a proficiency bonus nor specified attribute modifier: use their base attack roll modifier
    const baseModifier = actor.isOfType("npc")
        ? ability.statistic.check.modifiers
              .find((m) => m.type === "untyped" && m.slug === "base")
              ?.clone()
        : null;

    const StatisticCls = actor.skills.acrobatics.constructor as typeof Statistic;
    return new StatisticCls(actor, {
        slug: "counteract",
        label: "PF2E.Item.Spell.Counteract.Label",
        attribute: ability.statistic.attribute,
        rank: ability.statistic.rank || 1,
        check: { type: "check", modifiers: [baseModifier].filter(R.isTruthy) },
    });
}

/**
 * https://github.com/foundryvtt/pf2e/blob/895e512a3346ae9e7eeafbc59fdbac1b68651afa/src/module/item/spellcasting-entry/collection.ts#L343
 */
function warnInvalidDrop(
    warning: DropWarningType,
    { spell, groupId }: WarnInvalidDropParams
): void {
    const localize = localizer("PF2E.Item.Spell.Warning");
    if (warning === "invalid-rank" && typeof groupId === "number") {
        const spellRank = getSpellRankLabel(spell.baseRank);
        const targetRank = getSpellRankLabel(groupId);
        ui.notifications.warn(
            localize("InvalidRank", { spell: spell.name, spellRank, targetRank })
        );
    } else if (warning === "cantrip-mismatch") {
        const locKey = spell.isCantrip ? "CantripToRankedSlots" : "NonCantripToCantrips";
        ui.notifications.warn(localize(locKey, { spell: spell.name }));
    } else if (warning === "invalid-spell") {
        const type = game.i18n.format("PF2E.TraitFocus");
        ui.notifications.warn(localize("WrongSpellType", { type }));
    }
}

/**
 * https://github.com/foundryvtt/pf2e/blob/895e512a3346ae9e7eeafbc59fdbac1b68651afa/src/module/item/spellcasting-entry/helpers.ts#L29
 */
function spellSlotGroupIdToNumber(groupId: SpellSlotGroupId): ZeroToTen;
function spellSlotGroupIdToNumber(groupId: Maybe<string | number>): ZeroToTen | null;
function spellSlotGroupIdToNumber(groupId: Maybe<string | number>): ZeroToTen | null {
    if (groupId === "cantrips") return 0;
    const numericValue = Number(groupId ?? NaN);
    return numericValue.between(0, 10) ? (numericValue as ZeroToTen) : null;
}

type DropWarningType = "invalid-rank" | "cantrip-mismatch" | "invalid-spell";

interface WarnInvalidDropParams {
    spell: SpellPF2e;
    groupId?: Maybe<SpellSlotGroupId>;
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

type CreateSpellcastingSourceWithHighestStatistic = Omit<
    CreateSpellcastingSource,
    "attribute" | "proficiencyRank" | "proficiencySlug" | "tradition"
> & {
    withClassDcs?: boolean;
};

type WithCharges = {
    category: SpellcastingCategory | "charges";
    isStaff?: boolean;
    uses?: ValueAndMax;
};

type SpellcastingSheetDataWithCharges = Omit<SpellcastingSheetData, "category"> & WithCharges;

type SpellcastingEntryWithCharges<TActor extends ActorPF2e> = Omit<
    SpellcastingEntry<TActor>,
    "category" | "getSheetData"
> &
    WithCharges & {
        getSheetData(options?: {
            spells?: SpellCollection<TActor>;
            prepList?: boolean;
        }): Promise<SpellcastingSheetDataWithCharges>;
    };

type ChargesSpellcastingSheetData = SpellcastingSheetDataWithCharges & {
    isStaff: boolean;
    isCharges: boolean;
    uses: { value: number; max: number };
};

type SpellcastingEntryPF2eWithCharges<TParent extends ActorPF2e | null = ActorPF2e | null> = Omit<
    SpellcastingEntryPF2e<TParent>,
    "system" | "category"
> &
    WithCharges & {
        system: Omit<SpellcastingEntrySystemSource, "description" | "prepared"> &
            Omit<ItemSystemData, "level" | "traits"> & {
                prepared: {
                    value: SpellcastingCategory | "charges";
                    flexible: boolean;
                    validItems: "scroll" | null;
                };
            };
    };

export {
    createCounteractStatistic,
    createSpellcastingSource,
    createSpellcastingWithHighestStatisticSource,
    getHighestSpellcastingStatistic,
    getSpellcastingMaxRank,
    spellSlotGroupIdToNumber,
    warnInvalidDrop,
};
export type {
    ChargesSpellcastingSheetData,
    CreatedSpellcastingEntrySource,
    CreateSpellcastingSource,
    SpellcastingEntryPF2eWithCharges,
    SpellcastingEntryWithCharges,
};
