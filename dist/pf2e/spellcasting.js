import * as R from "remeda";
import { getStatisticClass } from "../classes";
import { localizer, ordinalString } from "./misc";
/** Try to coerce some value (typically from user input) to a slot group ID */
function coerceToSpellGroupId(value) {
    if (value === "cantrips")
        return value;
    const numericValue = Number(value) || NaN;
    return numericValue.between(1, 10) ? numericValue : null;
}
function warnInvalidDrop(warning, { spell, groupId }) {
    const localize = localizer("PF2E.Item.Spell.Warning");
    if (warning === "invalid-rank" && typeof groupId === "number") {
        const spellRank = game.i18n.format("PF2E.Item.Spell.Rank.Ordinal", {
            rank: ordinalString(spell.baseRank),
        });
        const targetRank = game.i18n.format("PF2E.Item.Spell.Rank.Ordinal", {
            rank: ordinalString(groupId),
        });
        ui.notifications.warn(localize("InvalidRank", { spell: spell.name, spellRank, targetRank }));
    }
    else if (warning === "cantrip-mismatch") {
        const locKey = spell.isCantrip ? "CantripToRankedSlots" : "NonCantripToCantrips";
        ui.notifications.warn(localize(locKey, { spell: spell.name }));
    }
    else if (warning === "invalid-spell") {
        const type = game.i18n.format("PF2E.TraitFocus");
        ui.notifications.warn(localize("WrongSpellType", { type }));
    }
}
function createCounteractStatistic(ability) {
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
export { coerceToSpellGroupId, createCounteractStatistic, warnInvalidDrop };
