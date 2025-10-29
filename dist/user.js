import { R } from ".";
function getCurrentUser() {
    return game.user ?? game.data.users.find((x) => x._id === game.userId);
}
function userIsGM(user = getCurrentUser()) {
    return user && user.role >= CONST.USER_ROLES.ASSISTANT;
}
function isPrimaryUpdater(actor) {
    return actor.primaryUpdater === game.user;
}
function primaryPlayerOwner(actor) {
    return game.users.getDesignatedUser((user) => user.active && !user.isGM && actor.testUserPermission(user, "OWNER"));
}
function isPrimaryOwner(actor, user = game.user) {
    return user.isGM || primaryPlayerOwner(actor) === user;
}
function canObserveActor(actor, withParty = true) {
    if (!actor)
        return false;
    const user = game.user;
    if (actor.testUserPermission(user, "OBSERVER"))
        return true;
    return (!!withParty &&
        game.pf2e.settings.metagame.partyStats &&
        actor.parties?.some((party) => party.testUserPermission(user, "LIMITED")));
}
function getSelectedActor(fn = (actor) => true) {
    const selected = R.only(canvas.tokens.controlled)?.actor;
    if (selected && fn(selected)) {
        return selected;
    }
    const assigned = game.user.character;
    return assigned && fn(assigned) ? assigned : null;
}
export { canObserveActor, getSelectedActor, isPrimaryOwner, isPrimaryUpdater, primaryPlayerOwner, userIsGM, };
