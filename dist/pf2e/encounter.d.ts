import { EncounterPF2e, RolledCombatant } from "foundry-pf2e";
declare function setInitiativeFromDrop(encounter: EncounterPF2e, newOrder: RolledCombatant<EncounterPF2e>[], dropped: RolledCombatant<EncounterPF2e>): void;
/** Save the new order, or reset the viewed order if no change was made */
declare function saveNewOrder(encounter: EncounterPF2e, newOrder: RolledCombatant<EncounterPF2e>[]): Promise<void>;
export { saveNewOrder, setInitiativeFromDrop };
