import { ActorPF2e, BaseSpellcastingEntry, CreaturePF2e, ItemSystemData, SpellcastingCategory, SpellcastingEntry, SpellcastingEntryPF2e, SpellcastingEntrySystemSource, SpellcastingSheetData, SpellCollection, SpellSlotGroupId, Statistic } from "foundry-pf2e";
/** Try to coerce some value (typically from user input) to a slot group ID */
declare function coerceToSpellGroupId(value: unknown): SpellSlotGroupId | null;
declare function warnInvalidDrop(warning: DropWarningType, { spell, groupId }: WarnInvalidDropParams): void;
declare function createCounteractStatistic<TActor extends CreaturePF2e>(ability: SpellcastingEntryWithCharges<TActor>): Statistic<TActor>;
type BaseSpellcastingEntryWithCharges<TActor extends ActorPF2e | null = ActorPF2e | null> = Omit<BaseSpellcastingEntry<TActor>, "category"> & {
    category: SpellcastingCategory | "charges";
};
type SpellcastingSheetDataWithCharges = Omit<SpellcastingSheetData, "category"> & {
    category: SpellcastingCategory | "charges";
};
type SpellcastingEntryWithCharges<TActor extends ActorPF2e> = Omit<SpellcastingEntry<TActor>, "category" | "getSheetData"> & {
    category: SpellcastingCategory | "charges";
    getSheetData(options?: {
        spells?: SpellCollection<TActor>;
        prepList?: boolean;
    }): Promise<SpellcastingSheetDataWithCharges>;
};
type SpellcastingEntryPF2eWithCharges<TParent extends ActorPF2e | null = ActorPF2e | null> = Omit<SpellcastingEntryPF2e<TParent>, "system" | "category"> & {
    category: SpellcastingCategory | "charges";
    system: Omit<SpellcastingEntrySystemSource, "description" | "prepared"> & Omit<ItemSystemData, "level" | "traits"> & {
        prepared: {
            value: SpellcastingCategory | "charges";
            flexible: boolean;
            validItems: "scroll" | null;
        };
    };
};
export { coerceToSpellGroupId, createCounteractStatistic, warnInvalidDrop };
export type { BaseSpellcastingEntryWithCharges, SpellcastingEntryWithCharges, SpellcastingEntryPF2eWithCharges, SpellcastingSheetDataWithCharges, };
