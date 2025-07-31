import { ActorAlliance, ActorPF2e, CreaturePF2e, LootPF2e } from "foundry-pf2e";
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

function isAllyActor(actor: ActorPF2e) {
    return actor.alliance === "party" || actor.testUserPermission(game.user, "OBSERVER");
}

async function getActorFromUuid(uuid: Maybe<string>): Promise<ActorPF2e | null> {
    if (!uuid) return null;
    const actor = await fromUuid<ActorPF2e>(uuid);
    return actor instanceof Actor ? actor : null;
}

function isMerchant(actor: Maybe<ActorPF2e>): actor is LootPF2e {
    return !!actor?.isOfType("loot") && actor.isMerchant;
}

type ActorTargetAlliance = "all" | "allies" | "enemies";

export {
    actorsRespectAlliance,
    getActorFromUuid,
    getDispositionColor,
    hasRollOption,
    isAllyActor,
    isMerchant,
    oppositeAlliance,
    playersCanSeeName,
};
export type { ActorTargetAlliance };
