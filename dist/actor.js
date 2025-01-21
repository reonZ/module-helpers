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
function getAlliance(actor) {
    const details = actor._source.system.details;
    const allianceSource = "alliance" in details ? details.alliance : undefined;
    const alliance = allianceSource === null ? "neutral" : allianceSource ?? "default";
    return alliance === "default" ? (actor.hasPlayerOwner ? "party" : "opposition") : alliance;
}
function isPlayedActor(actor) {
    return !!actor?.id && !actor.pack && game.actors.has(actor.id);
}
function getHighestName(actor) {
    return actor.token?.name ?? actor.prototypeToken?.name ?? actor.name;
}
function getOwner(actor, activeOnly = true) {
    const isValidUser = (user) => (!activeOnly || user.active) && !user.isGM;
    const validOwners = game.users.filter((user) => isValidUser(user));
    let owners = validOwners.filter((user) => user.character === actor);
    if (!owners.length) {
        owners = validOwners.filter((user) => actor.testUserPermission(user, "OWNER"));
    }
    owners.sort((a, b) => (a.id > b.id ? 1 : -1));
    return owners[0] || null;
}
function isOwner(actor) {
    return getOwner(actor) === game.user;
}
function getFirstDependentTokens(actor, { scene, linked = false } = {}) {
    if (!canvas.ready)
        return null;
    if (actor.isToken && !scene)
        return actor.token;
    scene ??= canvas.scene;
    if (actor.token) {
        const parent = actor.token.parent;
        return scene === parent ? actor.token : null;
    }
    const tokens = actor._dependentTokens.get(scene) ?? [];
    for (const token of tokens) {
        if (!linked || token.actorLink) {
            return token;
        }
    }
    return null;
}
function getFirstActiveToken(actor, linked = false, document = false, scene = canvas.scene ?? undefined) {
    if (!canvas.ready)
        return null;
    const token = getFirstDependentTokens(actor, { linked, scene });
    return document ? token : token?.rendered ? token.object : null;
}
function canObserveActor(actor, withParty) {
    if (!actor)
        return false;
    const user = game.user;
    if (actor.testUserPermission(user, "OBSERVER"))
        return true;
    return (!!withParty &&
        game.pf2e.settings.metagame.partyStats &&
        actor.parties?.some((party) => party.testUserPermission(user, "LIMITED")));
}
function isFriendActor(actor) {
    const user = game.user;
    if (actor.testUserPermission(user, "OBSERVER"))
        return true;
    return (actor.testUserPermission(user, "OBSERVER") ||
        actor.parties?.some((party) => party.testUserPermission(user, "LIMITED")));
}
function getWorldActor(actor) {
    return actor?.token?.baseActor ?? actor ?? null;
}
function getMythicOrHeroPoints(actor) {
    const name = actor.system.resources.mythicPoints.max ? "mythicPoints" : "heroPoints";
    return {
        ...(name === "mythicPoints"
            ? actor.system.resources.mythicPoints
            : actor.system.resources.heroPoints),
        name,
    };
}
function isCurrentCombatant(actor) {
    return game.combat?.combatant === actor.combatant;
}
function actorsRespectAlliance(origin, target, alliance = "all") {
    return alliance === "all"
        ? true
        : alliance === "allies"
            ? target.isAllyOf(origin)
            : target.isEnemyOf(origin);
}
function hasRollOption(actor, option) {
    const rolloptionsDomains = Object.values(actor.rollOptions);
    return rolloptionsDomains.some((rollOptions) => !!rollOptions[option]);
}
export { actorsRespectAlliance, canObserveActor, getAlliance, getDispositionColor, getFirstActiveToken, getHighestName, getMythicOrHeroPoints, getOwner, getWorldActor, hasRollOption, isCurrentCombatant, isFriendActor, isOwner, isPlayedActor, };
