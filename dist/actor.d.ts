import { ActorPF2e } from "foundry-pf2e";
declare function actorsRespectAlliance(origin: ActorPF2e, target: ActorPF2e, alliance?: ActorTargetAlliance): boolean;
declare function hasRollOption(actor: ActorPF2e, option: string): boolean;
declare function playersCanSeeName(actor: ActorPF2e, user?: Active<import("foundry-pf2e/pf2e/module/user/document.js").UserPF2e>): boolean;
type ActorTargetAlliance = "all" | "allies" | "enemies";
export { actorsRespectAlliance, hasRollOption, playersCanSeeName };
export type { ActorTargetAlliance };
