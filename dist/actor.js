import { R } from ".";
function actorsRespectAlliance(origin, target, alliance = "all") {
    return alliance === "allies"
        ? target.isAllyOf(origin)
        : alliance === "enemies"
            ? target.isEnemyOf(origin)
            : true;
}
function oppositeAlliance(alliance) {
    return alliance === "party" ? "opposition" : alliance === "opposition" ? "party" : null;
}
function hasRollOption(actor, option) {
    const rolloptionsDomains = R.values(actor.rollOptions);
    return rolloptionsDomains.some((rollOptions) => rollOptions[option]);
}
function playersCanSeeName(actor, user = game.user) {
    return (actor.token?.playersCanSeeName ||
        actor.alliance === "party" ||
        actor.testUserPermission(user, "LIMITED") ||
        actor.parties?.some((party) => party.testUserPermission(user, "LIMITED")));
}
function isAllyActor(actor) {
    return actor.alliance === "party" || actor.testUserPermission(game.user, "OBSERVER");
}
async function getActorFromUuid(uuid) {
    if (!uuid)
        return null;
    const actor = await fromUuid(uuid);
    return actor instanceof Actor ? actor : null;
}
export { actorsRespectAlliance, getActorFromUuid, hasRollOption, isAllyActor, oppositeAlliance, playersCanSeeName, };
