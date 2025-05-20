import { ActorPF2e, UserPF2e } from "foundry-pf2e";
declare function userIsGM(user?: UserPF2e): boolean;
declare function isPrimaryUpdater(actor: ActorPF2e): boolean;
export { isPrimaryUpdater, userIsGM };
