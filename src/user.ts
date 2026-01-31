import { ActorPF2e, CreaturePF2e, UserPF2e } from "foundry-pf2e";
import { R } from ".";

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
    // even though we want a player, assigned users take priority
    const assigned = game.users.getDesignatedUser((user) => user.active && user.character === (actor as Actor));

    return (
        assigned ??
        game.users.getDesignatedUser((user) => user.active && !user.isGM && actor.testUserPermission(user, "OWNER"))
    );
}

function isPrimaryOwner(actor: ActorPF2e, user = game.user): boolean {
    return user.isGM || primaryPlayerOwner(actor) === user;
}

function canObserveActor(actor: Maybe<ActorPF2e>, withParty: boolean = true): actor is ActorPF2e {
    if (!actor) return false;

    const user = game.user;
    if (actor.testUserPermission(user, "OBSERVER")) return true;

    return (
        !!withParty &&
        game.pf2e.settings.metagame.partyStats &&
        (actor as CreaturePF2e).parties?.some((party) => party.testUserPermission(user, "LIMITED"))
    );
}

function getSelectedActor(fn = (actor: ActorPF2e) => true): ActorPF2e | null {
    const selected = R.only(canvas.tokens.controlled)?.actor;

    if (selected && fn(selected)) {
        return selected;
    }

    const assigned = game.user.character;
    return assigned && fn(assigned) ? assigned : null;
}

export { canObserveActor, getSelectedActor, isPrimaryOwner, isPrimaryUpdater, primaryPlayerOwner, userIsGM };
