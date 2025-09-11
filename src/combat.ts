import { ActorPF2e, CombatantPF2e, EncounterPF2e, RolledCombatant } from "foundry-pf2e";
import { getActorMaster } from ".";

function hasRolledInitiative(
    combatant: CombatantPF2e
): combatant is RolledCombatant<EncounterPF2e> {
    return typeof combatant.initiative === "number";
}

function isCurrentCombatant(actor: ActorPF2e): boolean {
    const current = game.combat?.combatant;
    if (!current) return false;

    return actor.combatant === current || getActorMaster(actor)?.combatant === current;
}

function isInCombat(actor: ActorPF2e): boolean {
    return actor.inCombat || !!getActorMaster(actor)?.inCombat;
}

export { hasRolledInitiative, isCurrentCombatant, isInCombat };
