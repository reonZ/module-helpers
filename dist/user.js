import * as R from "remeda";
function getCurrentUser() {
    return game.user ?? game.data.users.find((x) => x._id === game.userId);
}
function userIsGM(user = getCurrentUser()) {
    return user && user.role >= CONST.USER_ROLES.ASSISTANT;
}
function userIsActiveGM(user = getCurrentUser()) {
    return user === game.users.activeGM;
}
function hasGMOnline() {
    return game.users.some((user) => user.active && user.isGM);
}
function setControlled(targets) {
    canvas.tokens.releaseAll();
    for (const target of targets) {
        const token = target instanceof TokenDocument ? target.object : target;
        token?.control({ releaseOthers: false });
    }
}
function getActor() {
    return R.only(canvas.tokens.controlled)?.actor ?? game.user.character;
}
function isPrimaryUpdater(actor) {
    return actor.primaryUpdater === game.user;
}
export { getActor, hasGMOnline, isPrimaryUpdater, setControlled, userIsActiveGM, userIsGM };
