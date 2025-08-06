import { ActorPF2e, CreaturePF2e, UserPF2e } from "foundry-pf2e";

function getCurrentUser(): UserPF2e {
    return game.user ?? game.data.users.find((x) => x._id === game.userId);
}

function userIsGM(user: UserPF2e = getCurrentUser()): boolean {
    return user && user.role >= CONST.USER_ROLES.ASSISTANT;
}

function isPrimaryUpdater(actor: ActorPF2e): boolean {
    return actor.primaryUpdater === game.user;
}

function primaryPlayerOwner(actor: ActorPF2e): UserPF2e | null {
    return game.users.getDesignatedUser(
        (user) => user.active && !user.isGM && actor.testUserPermission(user, "OWNER")
    );
}

function isPrimaryOwner(actor: ActorPF2e, user = game.user): boolean {
    return user.isGM || primaryPlayerOwner(actor) === user;
}

function canObserveActor(actor: Maybe<ActorPF2e>, withParty: boolean = true) {
    if (!actor) return false;

    const user = game.user;
    if (actor.testUserPermission(user, "OBSERVER")) return true;

    return (
        !!withParty &&
        game.pf2e.settings.metagame.partyStats &&
        (actor as CreaturePF2e).parties?.some((party) => party.testUserPermission(user, "LIMITED"))
    );
}

export { canObserveActor, isPrimaryOwner, isPrimaryUpdater, primaryPlayerOwner, userIsGM };
