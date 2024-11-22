import { CreaturePF2e, SpellcastingEntry, SpellSlotGroupId, Statistic } from "foundry-pf2e";
/** Try to coerce some value (typically from user input) to a slot group ID */
declare function coerceToSpellGroupId(value: unknown): SpellSlotGroupId | null;
declare function warnInvalidDrop(warning: DropWarningType, { spell, groupId }: WarnInvalidDropParams): void;
declare function createCounteractStatistic<TActor extends CreaturePF2e>(ability: SpellcastingEntry<TActor>): Statistic<TActor>;
export { coerceToSpellGroupId, createCounteractStatistic, warnInvalidDrop };
