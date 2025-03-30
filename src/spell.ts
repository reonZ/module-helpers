import { ActorPF2e, SpellSource, ZeroToTen } from "foundry-pf2e";
import { htmlQueryAll, ordinalString } from "./pf2e";
import * as R from "remeda";
import { getUuidFromInlineMatch, isInstanceOf } from ".";

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

async function getSpellsFromDescriptionList(
    ul: HTMLElement,
    maxCharges: number = Infinity
): Promise<SpellSource[]> {
    const spellRanksList = htmlQueryAll(ul, "li");

    const staffSpellData = R.pipe(
        spellRanksList,
        R.flatMap((SpellRankEL) => {
            const label = SpellRankEL.firstChild as HTMLElement;
            const rank = Number(label.textContent?.match(LABEL_REGEX)?.[0] || "0") as ZeroToTen;
            const text = SpellRankEL.textContent ?? "";
            const uuids = Array.from(text.matchAll(UUID_REGEX)).map(getUuidFromInlineMatch);

            return uuids.map((uuid) => ({ rank, uuid }));
        }),
        R.filter(({ rank }) => rank <= maxCharges)
    );

    const spells = await Promise.all(
        staffSpellData.map(async ({ rank, uuid }) => {
            const spell = await fromUuid(uuid);
            if (!isInstanceOf(spell, "SpellPF2e")) return;

            return foundry.utils.mergeObject(
                spell._source,
                {
                    _id: foundry.utils.randomID(),
                    system: { location: { value: null, heightenedLevel: rank } },
                },
                { inplace: false }
            );
        })
    );

    return R.filter(spells, R.isTruthy);
}

export { getRankLabel, getSpellsFromDescriptionList, hasSpells };
