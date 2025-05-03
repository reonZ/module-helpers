import { ActorPF2e } from "foundry-pf2e";
declare function actorsRespectAlliance(origin: ActorPF2e, target: ActorPF2e, alliance?: ActorTargetAlliance): boolean;
declare function hasRollOption(actor: ActorPF2e, option: string): boolean;
type ActorTargetAlliance = "all" | "allies" | "enemies";
export { actorsRespectAlliance, hasRollOption };
export type { ActorTargetAlliance };
