import {
    ActorPF2e,
    BaseSpellcastingEntry,
    CreaturePF2e,
    ItemSystemData,
    OneToTen,
    SpellcastingCategory,
    SpellcastingEntry,
    SpellcastingEntryPF2e,
    SpellcastingEntrySystemSource,
    SpellcastingSheetData,
    SpellCollection,
    SpellSlotGroupId,
    Statistic,
} from "foundry-pf2e";
import * as R from "remeda";
import { getStatisticClass } from "../classes";
import { localizer, ordinalString } from "./misc";

/** Try to coerce some value (typically from user input) to a slot group ID */
function coerceToSpellGroupId(value: unknown): SpellSlotGroupId | null {
    if (value === "cantrips") return value;
    const numericValue = Number(value) || NaN;
    return numericValue.between(1, 10) ? (numericValue as OneToTen) : null;
}

function warnInvalidDrop(
    warning: DropWarningType,
    { spell, groupId }: WarnInvalidDropParams
): void {
    const localize = localizer("PF2E.Item.Spell.Warning");
    if (warning === "invalid-rank" && typeof groupId === "number") {
        const spellRank = game.i18n.format("PF2E.Item.Spell.Rank.Ordinal", {
            rank: ordinalString(spell.baseRank),
        });
        const targetRank = game.i18n.format("PF2E.Item.Spell.Rank.Ordinal", {
            rank: ordinalString(groupId),
        });
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

    const Statistic = getStatisticClass(actor.skills.acrobatics);
    return new Statistic(actor, {
        slug: "counteract",
        label: "PF2E.Item.Spell.Counteract.Label",
        attribute: ability.statistic.attribute,
        rank: ability.statistic.rank || 1,
        check: { type: "check", modifiers: R.filter([baseModifier], R.isTruthy) },
    });
}

type BaseSpellcastingEntryWithCharges<TActor extends ActorPF2e | null = ActorPF2e | null> = Omit<
    BaseSpellcastingEntry<TActor>,
    "category"
> & {
    category: SpellcastingCategory | "charges";
};

type SpellcastingSheetDataWithCharges = Omit<SpellcastingSheetData, "category"> & {
    category: SpellcastingCategory | "charges";
};

type SpellcastingEntryWithCharges<TActor extends ActorPF2e> = Omit<
    SpellcastingEntry<TActor>,
    "category" | "getSheetData"
> & {
    category: SpellcastingCategory | "charges";
    getSheetData(options?: {
        spells?: SpellCollection<TActor>;
        prepList?: boolean;
    }): Promise<SpellcastingSheetDataWithCharges>;
};

type SpellcastingEntryPF2eWithCharges<TParent extends ActorPF2e | null = ActorPF2e | null> = Omit<
    SpellcastingEntryPF2e<TParent>,
    "system" | "category"
> & {
    category: SpellcastingCategory | "charges";
    system: Omit<SpellcastingEntrySystemSource, "description" | "prepared"> &
        Omit<ItemSystemData, "level" | "traits"> & {
            prepared: {
                value: SpellcastingCategory | "charges";
                flexible: boolean;
                validItems: "scroll" | null;
            };
        };
};

export { coerceToSpellGroupId, createCounteractStatistic, warnInvalidDrop };
export type {
    BaseSpellcastingEntryWithCharges,
    SpellcastingEntryWithCharges,
    SpellcastingEntryPF2eWithCharges,
    SpellcastingSheetDataWithCharges,
};
