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

type ActorTargetAlliance = "all" | "allies" | "enemies";

export { actorsRespectAlliance, hasRollOption, playersCanSeeName };
export type { ActorTargetAlliance };
