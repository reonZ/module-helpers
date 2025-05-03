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
export { actorsRespectAlliance, hasRollOption };
