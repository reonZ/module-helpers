import { ActorPF2e, ZeroToTen } from "foundry-pf2e";
import * as R from "remeda";
import { getUuidFromInlineMatch } from ".";
import { htmlQueryAll, ordinalString } from "./pf2e";

const UUID_REGEX = /@(uuid|compendium)\[([a-z0-9\._-]+)\]/gi;
const LABEL_REGEX = /\d+/;

function hasSpells(actor: ActorPF2e) {
    return (
        actor.isOfType("character", "npc") &&
        actor.spellcasting.contents.some(
            (entry) =>
                (entry.spells?.size && entry.spells?.size > 0) ||
                (entry.isEphemeral && entry.id.endsWith("-casting"))
        )
    );
}

function getRankLabel(rank: ZeroToTen) {
    return game.i18n.format("PF2E.Item.Spell.Rank.Ordinal", {
        rank: ordinalString(rank),
    });
}

function getSpellsDataFromDescriptionList(
    ul: HTMLElement,
    maxCharges: number = Infinity
): { rank: ZeroToTen; uuid: string }[] {
    return R.pipe(
        htmlQueryAll(ul, "li"),
        R.flatMap((SpellRankEL) => {
            const label = SpellRankEL.firstChild as HTMLElement;
            const rank = Number(label.textContent?.match(LABEL_REGEX)?.[0] || "0") as ZeroToTen;
            const text = SpellRankEL.textContent ?? "";
            const uuids = Array.from(text.matchAll(UUID_REGEX)).map(getUuidFromInlineMatch);

            return uuids.map((uuid) => ({ rank, uuid }));
        }),
        R.filter(({ rank }) => rank <= maxCharges)
    );
}

export { getRankLabel, getSpellsDataFromDescriptionList, hasSpells };
