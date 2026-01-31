import { ActorPF2e, UserPF2e } from "foundry-pf2e";
declare function userIsGM(user?: UserPF2e): boolean;
declare function isPrimaryUpdater(actor: ActorPF2e): boolean;
declare function primaryPlayerOwner(actor: ActorPF2e): UserPF2e | null;
declare function isPrimaryOwner(actor: ActorPF2e, user?: Active<UserPF2e>): boolean;
declare function canObserveActor(actor: Maybe<ActorPF2e>, withParty?: boolean): actor is ActorPF2e;
declare function getSelectedActor(fn?: (actor: ActorPF2e) => boolean): ActorPF2e | null;
export { canObserveActor, getSelectedActor, isPrimaryOwner, isPrimaryUpdater, primaryPlayerOwner, userIsGM };
