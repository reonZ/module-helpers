function hasRolledInitiative(combatant) {
    return typeof combatant.initiative === "number";
}
function isCurrentCombatant(actor) {
    const current = game.combat?.combatant;
    if (!current)
        return false;
    return (actor.combatant === current ||
        actor.master?.combatant === current ||
        game.toolbelt?.api.shareData.getMasterInMemory(actor)?.combatant === current);
}
function isInCombat(actor) {
    return (actor.inCombat ||
        !!actor.master?.inCombat ||
        !!game.toolbelt?.api.shareData.getMasterInMemory(actor)?.inCombat);
}
export { hasRolledInitiative, isCurrentCombatant, isInCombat };
