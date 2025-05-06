function isCurrentCombatant(actor) {
    return game.combat?.combatant === actor.combatant;
}
export { isCurrentCombatant };
