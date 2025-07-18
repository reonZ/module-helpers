function hasRolledInitiative(combatant) {
    return typeof combatant.initiative === "number";
}
function isCurrentCombatant(actor) {
    return game.combat?.combatant === actor.combatant;
}
export { hasRolledInitiative, isCurrentCombatant };
