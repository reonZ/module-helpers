function actorsRespectAlliance(origin, target, alliance = "all") {
    return alliance === "allies"
        ? target.isAllyOf(origin)
        : alliance === "enemies"
            ? target.isEnemyOf(origin)
            : true;
}
export { actorsRespectAlliance };
