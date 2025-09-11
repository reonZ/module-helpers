import {
    ActorPF2e,
    CombatantPF2e,
    CreaturePF2e,
    EncounterPF2e,
    FamiliarPF2e,
    RolledCombatant,
} from "foundry-pf2e";

function hasRolledInitiative(
    combatant: CombatantPF2e
): combatant is RolledCombatant<EncounterPF2e> {
    return typeof combatant.initiative === "number";
}

function isCurrentCombatant(actor: ActorPF2e): boolean {
    const current = game.combat?.combatant;
    if (!current) return false;

    return (
        actor.combatant === current ||
        (actor as FamiliarPF2e).master?.combatant === current ||
        game.toolbelt?.api.shareData.getMasterInMemory(actor as CreaturePF2e)?.combatant === current
    );
}

function isInCombat(actor: ActorPF2e): boolean {
    return (
        actor.inCombat ||
        !!(actor as FamiliarPF2e).master?.inCombat ||
        !!game.toolbelt?.api.shareData.getMasterInMemory(actor as CreaturePF2e)?.inCombat
    );
}

export { hasRolledInitiative, isCurrentCombatant, isInCombat };
