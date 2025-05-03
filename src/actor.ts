import { ActorPF2e } from "foundry-pf2e";
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

type ActorTargetAlliance = "all" | "allies" | "enemies";

export { actorsRespectAlliance, hasRollOption };
export type { ActorTargetAlliance };
