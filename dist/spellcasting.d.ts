import { ActorPF2e, AttributeString, CharacterPF2e, CreaturePF2e, ItemSystemData, MagicTradition, NPCPF2e, OneToTen, SpellcastingCategory, SpellcastingEntry, SpellcastingEntryPF2e, SpellcastingEntrySource, SpellcastingEntrySystemSource, SpellcastingSheetData, SpellCollection, SpellPF2e, SpellSlotGroupId, Statistic, ValueAndMax, ZeroToFour, ZeroToTen } from "foundry-pf2e";
declare function createSpellcastingSource({ name, category, attribute, flags, proficiencyRank, proficiencySlug, showSlotlessRanks, sort, tradition, }: CreateSpellcastingSource): CreatedSpellcastingEntrySource;
declare function getHighestSpellcastingStatistic(actor: NPCPF2e | CharacterPF2e): {
    tradition: "arcane" | "divine" | "occult" | "primal" | null;
    statistic: Statistic<ActorPF2e<import("foundry-pf2e/pf2e/module/scene/token-document/document.js").TokenDocumentPF2e<import("foundry-pf2e/pf2e/module/scene/document.js").ScenePF2e | null> | null>>;
} | undefined;
declare function createSpellcastingWithHighestStatisticSource(actor: NPCPF2e | CharacterPF2e, { name, category, flags, showSlotlessRanks, sort, withClassDcs, }: CreateSpellcastingSourceWithHighestStatistic): CreatedSpellcastingEntrySource | undefined;
declare function getSpellcastingMaxRank(entry: SpellcastingEntryPF2e, rankLimit?: OneToTen): ZeroToTen;
/**
 * https://github.com/foundryvtt/pf2e/blob/49dc6d70c7e7bb26d8039c97361e638bdef6a3bd/src/module/item/spellcasting-entry/helpers.ts#L10
 */
declare function createCounteractStatistic<TActor extends CreaturePF2e>(ability: SpellcastingEntryWithCharges<TActor>): Statistic<TActor>;
/**
 * https://github.com/foundryvtt/pf2e/blob/895e512a3346ae9e7eeafbc59fdbac1b68651afa/src/module/item/spellcasting-entry/collection.ts#L343
 */
declare function warnInvalidDrop(warning: DropWarningType, { spell, groupId }: WarnInvalidDropParams): void;
/**
 * https://github.com/foundryvtt/pf2e/blob/895e512a3346ae9e7eeafbc59fdbac1b68651afa/src/module/item/spellcasting-entry/helpers.ts#L29
 */
declare function spellSlotGroupIdToNumber(groupId: SpellSlotGroupId): ZeroToTen;
declare function spellSlotGroupIdToNumber(groupId: Maybe<string | number>): ZeroToTen | null;
type DropWarningType = "invalid-rank" | "cantrip-mismatch" | "invalid-spell";
interface WarnInvalidDropParams {
    spell: SpellPF2e;
    groupId?: Maybe<SpellSlotGroupId>;
}
type CreatedSpellcastingEntrySource = Omit<PreCreate<SpellcastingEntrySource>, "system"> & {
    system: DeepPartial<SpellcastingEntrySystemSource>;
};
type CreateSpellcastingSource = {
    name: string;
    category?: SpellcastingCategory | "charges";
    sort?: number;
    attribute?: AttributeString | null;
    proficiencySlug?: string;
    showSlotlessRanks?: boolean;
    proficiencyRank?: ZeroToFour | null;
    tradition?: MagicTradition;
    flags?: Record<string, any>;
};
type CreateSpellcastingSourceWithHighestStatistic = Omit<CreateSpellcastingSource, "attribute" | "proficiencyRank" | "proficiencySlug" | "tradition"> & {
    withClassDcs?: boolean;
};
type WithCharges = {
    category: SpellcastingCategory | "charges";
    isStaff?: boolean;
    uses?: ValueAndMax;
};
type SpellcastingSheetDataWithCharges = Omit<SpellcastingSheetData, "category"> & WithCharges;
type SpellcastingEntryWithCharges<TActor extends ActorPF2e> = Omit<SpellcastingEntry<TActor>, "category" | "getSheetData"> & WithCharges & {
    getSheetData(options?: {
        spells?: SpellCollection<TActor>;
        prepList?: boolean;
    }): Promise<SpellcastingSheetDataWithCharges>;
};
type ChargesSpellcastingSheetData = SpellcastingSheetDataWithCharges & {
    isStaff: boolean;
    isCharges: boolean;
    uses: {
        value: number;
        max: number;
    };
};
type SpellcastingEntryPF2eWithCharges<TParent extends ActorPF2e | null = ActorPF2e | null> = Omit<SpellcastingEntryPF2e<TParent>, "system" | "category"> & WithCharges & {
    system: Omit<SpellcastingEntrySystemSource, "description" | "prepared"> & Omit<ItemSystemData, "level" | "traits"> & {
        prepared: {
            value: SpellcastingCategory | "charges";
            flexible: boolean;
            validItems: "scroll" | null;
        };
    };
};
export { createCounteractStatistic, createSpellcastingSource, createSpellcastingWithHighestStatisticSource, getHighestSpellcastingStatistic, getSpellcastingMaxRank, spellSlotGroupIdToNumber, warnInvalidDrop, };
export type { ChargesSpellcastingSheetData, CreatedSpellcastingEntrySource, CreateSpellcastingSource, SpellcastingEntryPF2eWithCharges, SpellcastingEntryWithCharges, };
