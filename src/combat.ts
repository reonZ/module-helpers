import { ActorPF2e, CombatantPF2e, EncounterPF2e, RolledCombatant } from "foundry-pf2e";

function hasRolledInitiative(
    combatant: CombatantPF2e
): combatant is RolledCombatant<EncounterPF2e> {
    return typeof combatant.initiative === "number";
}

function isCurrentCombatant(actor: ActorPF2e) {
    return game.combat?.combatant === actor.combatant;
}

export { hasRolledInitiative, isCurrentCombatant };
