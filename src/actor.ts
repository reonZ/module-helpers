import { ActorPF2e } from "foundry-pf2e";

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

type ActorTargetAlliance = "all" | "allies" | "enemies";

export { actorsRespectAlliance };
export type { ActorTargetAlliance };
