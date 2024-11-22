import { ActorPF2e, CombatantPF2e, EncounterPF2e, RolledCombatant } from "foundry-pf2e";
declare function hasRolledInitiative(combatant: CombatantPF2e): combatant is RolledCombatant<EncounterPF2e>;
declare function rollInitiative(actor: ActorPF2e, statistic?: string, event?: Event): Promise<import("foundry-pf2e/pf2e/module/actor/initiative.js").InitiativeRollResult | null> | undefined;
export { hasRolledInitiative, rollInitiative };
