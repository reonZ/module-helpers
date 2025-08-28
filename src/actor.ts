import {
    ActorAlliance,
    ActorPF2e,
    CharacterPF2e,
    CreaturePF2e,
    LootPF2e,
    ValueAndMax,
} from "foundry-pf2e";
import { R } from ".";

function actorsRespectAlliance(
    origin: ActorPF2e,
    target: ActorPF2e,
    alliance: ActorTargetAlliance = "all"
) {
    return alliance === "allies"
        ? target.isAllyOf(origin)
        : alliance === "enemies"
        ? target.isEnemyOf(origin)
        : true;
}

function getDispositionColor(actor?: ActorPF2e | null) {
    const alliance = actor?.alliance;
    const colorValue = !actor
        ? CONFIG.Canvas.dispositionColors.NEUTRAL
        : alliance === "party"
        ? actor.hasPlayerOwner
            ? CONFIG.Canvas.dispositionColors.PARTY
            : CONFIG.Canvas.dispositionColors.FRIENDLY
        : alliance === "opposition"
        ? CONFIG.Canvas.dispositionColors.HOSTILE
        : CONFIG.Canvas.dispositionColors.NEUTRAL;

    return new Color(colorValue);
}

function belongToPartyAlliance(actor: ActorPF2e): boolean {
    return actor.system.details.alliance === "party";
}

function oppositeAlliance(alliance: ActorAlliance) {
    return alliance === "party" ? "opposition" : alliance === "opposition" ? "party" : null;
}

function hasRollOption(actor: ActorPF2e, option: string) {
    const rolloptionsDomains = R.values(actor.rollOptions) as Record<string, boolean>[];
    return rolloptionsDomains.some((rollOptions) => rollOptions[option]);
}

function playersCanSeeName(actor: ActorPF2e, user = game.user) {
    return (
        actor.token?.playersCanSeeName ||
        actor.alliance === "party" ||
        actor.testUserPermission(user, "LIMITED") ||
        (actor as CreaturePF2e).parties?.some((party) => party.testUserPermission(user, "LIMITED"))
    );
}

function actorIsPartyMember(actor: ActorPF2e): boolean {
    const activeParty = game.actors.party;
    if (!activeParty) return false;

    return (actor as CreaturePF2e).parties?.some((party) => party === activeParty);
}

function isAllyActor(actor: ActorPF2e) {
    return actor.alliance === "party" || actor.testUserPermission(game.user, "OBSERVER");
}

async function getActorFromUuid(uuid: Maybe<string>): Promise<ActorPF2e | null> {
    if (!uuid) return null;
    const actor = await fromUuid<ActorPF2e>(uuid);
    return actor instanceof Actor ? actor : null;
}

function getMythicOrHeroPoints(
    actor: CharacterPF2e
): ValueAndMax & { name: "mythicPoints" | "heroPoints" } {
    const name = actor.system.resources.mythicPoints.max ? "mythicPoints" : "heroPoints";
    return {
        ...(name === "mythicPoints"
            ? actor.system.resources.mythicPoints
            : actor.system.resources.heroPoints),
        name,
    };
}

function isMerchant(actor: Maybe<ActorPF2e>): actor is LootPF2e {
    return !!actor?.isOfType("loot") && actor.isMerchant;
}

type ActorTargetAlliance = "all" | "allies" | "enemies";

export {
    actorIsPartyMember,
    actorsRespectAlliance,
    belongToPartyAlliance,
    getActorFromUuid,
    getDispositionColor,
    getMythicOrHeroPoints,
    hasRollOption,
    isAllyActor,
    isMerchant,
    oppositeAlliance,
    playersCanSeeName,
};
export type { ActorTargetAlliance };
