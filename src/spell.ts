import { ordinalString } from ".";

const MAGIC_TRADITIONS = new Set(["arcane", "divine", "occult", "primal"] as const);

/**
 * https://github.com/foundryvtt/pf2e/blob/5ebcd0359d1358bb00b76c47e7b84289239234b9/src/module/item/spellcasting-entry/helpers.ts#L43
 */
function getSpellRankLabel(group: "cantrips" | number): string {
    return group === 0 || group === "cantrips"
        ? game.i18n.localize("PF2E.Actor.Creature.Spellcasting.Cantrips")
        : game.i18n.format("PF2E.Item.Spell.Rank.Ordinal", { rank: ordinalString(group) });
}

export { getSpellRankLabel, MAGIC_TRADITIONS };
