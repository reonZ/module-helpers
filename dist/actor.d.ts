import { ActorPF2e } from "foundry-pf2e";
declare function actorsRespectAlliance(origin: ActorPF2e, target: ActorPF2e, alliance?: ActorTargetAlliance): boolean;
type ActorTargetAlliance = "all" | "allies" | "enemies";
export { actorsRespectAlliance };
export type { ActorTargetAlliance };
