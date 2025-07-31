import { R } from ".";
function actorsRespectAlliance(origin, target, alliance = "all") {
    return alliance === "allies"
        ? target.isAllyOf(origin)
        : alliance === "enemies"
            ? target.isEnemyOf(origin)
            : true;
}
function getDispositionColor(actor) {
    const alliance = actor?.alliance;
    const colorValue = !actor
        ? CONFIG.Canvas.dispositionColors.NEUTRAL
        : alliance === "party"
            ? actor.hasPlayerOwner
                ? CONFIG.Canvas.dispositionColors.PARTY
                : CONFIG.Canvas.dispositionColors.FRIENDLY
            : alliance === "opposition"
                ? CONFIG.Canvas.dispositionColors.HOSTILE
                : CONFIG.Canvas.dispositionColors.NEUTRAL;
    return new Color(colorValue);
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
function isMerchant(actor) {
    return !!actor?.isOfType("loot") && actor.isMerchant;
}
export { actorsRespectAlliance, getActorFromUuid, getDispositionColor, hasRollOption, isAllyActor, isMerchant, oppositeAlliance, playersCanSeeName, };
