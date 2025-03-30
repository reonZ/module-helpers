import * as R from "remeda";
import { getUuidFromInlineMatch } from ".";
import { htmlQueryAll, ordinalString } from "./pf2e";
const UUID_REGEX = /@(uuid|compendium)\[([a-z0-9\._-]+)\]/gi;
const LABEL_REGEX = /\d+/;
function hasSpells(actor) {
    return (actor.isOfType("character", "npc") &&
        actor.spellcasting.contents.some((entry) => (entry.spells?.size && entry.spells?.size > 0) ||
            (entry.isEphemeral && entry.id.endsWith("-casting"))));
}
function getRankLabel(rank) {
    return game.i18n.format("PF2E.Item.Spell.Rank.Ordinal", {
        rank: ordinalString(rank),
    });
}
function getSpellsDataFromDescriptionList(ul, maxRank = Infinity) {
    return R.pipe(htmlQueryAll(ul, "li"), R.flatMap((SpellRankEL) => {
        const label = SpellRankEL.firstChild;
        const rank = Number(label.textContent?.match(LABEL_REGEX)?.[0] || "0");
        const text = SpellRankEL.textContent ?? "";
        const uuids = Array.from(text.matchAll(UUID_REGEX)).map(getUuidFromInlineMatch);
        return uuids.map((uuid) => ({ rank, uuid }));
    }), R.filter(({ rank }) => rank <= maxRank));
}
export { getRankLabel, getSpellsDataFromDescriptionList, hasSpells };
