import { AttributeString, MagicTradition, OneToTen, SpellcastingCategory, SpellcastingEntryPF2e, SpellcastingEntrySource, SpellcastingEntrySystemSource, ZeroToFour, ZeroToTen } from "foundry-pf2e";
declare function createSpellcastingSource({ name, category, attribute, flags, proficiencyRank, proficiencySlug, showSlotlessRanks, sort, tradition, }: CreateSpellcastingSource): CreatedSpellcastingEntrySource;
declare function getSpellcastingMaxRank(entry: SpellcastingEntryPF2e, rankLimit?: OneToTen): ZeroToTen;
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
export { createSpellcastingSource, getSpellcastingMaxRank };
export type { CreatedSpellcastingEntrySource, CreateSpellcastingSource };
