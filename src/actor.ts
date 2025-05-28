import { ActorPF2e, CreaturePF2e } from "foundry-pf2e";
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

type ActorTargetAlliance = "all" | "allies" | "enemies";

export { actorsRespectAlliance, hasRollOption, isAllyActor, getActorFromUuid, playersCanSeeName };
export type { ActorTargetAlliance };
