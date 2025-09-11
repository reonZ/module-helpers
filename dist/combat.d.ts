import { ActorPF2e, CombatantPF2e, EncounterPF2e, RolledCombatant } from "foundry-pf2e";
declare function hasRolledInitiative(combatant: CombatantPF2e): combatant is RolledCombatant<EncounterPF2e>;
declare function isCurrentCombatant(actor: ActorPF2e): boolean;
declare function isInCombat(actor: ActorPF2e): boolean;
export { hasRolledInitiative, isCurrentCombatant, isInCombat };
