import { R } from ".";
function actorsRespectAlliance(origin, target, alliance = "all") {
    return alliance === "allies"
        ? target.isAllyOf(origin)
        : alliance === "enemies"
            ? target.isEnemyOf(origin)
            : true;
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
export { actorsRespectAlliance, hasRollOption, playersCanSeeName };
