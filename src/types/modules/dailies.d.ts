import {
    ActorPF2e,
    CharacterPF2e,
    EquipmentPF2e,
    MagicTradition,
    OneToFour,
    PhysicalItemPF2e,
    SpellcastingEntry,
    SpellcastingEntryPF2e,
    SpellSource,
    WeaponPF2e,
    ZeroToTen,
} from "foundry-pf2e";

export {};

declare global {
    namespace dailies {
        type StaffPF2e = WeaponPF2e<CharacterPF2e> | EquipmentPF2e<CharacterPF2e>;

        type StaffFlags = {
            staffId: string;
            charges: {
                value: number;
                max: number;
            };
            expended: boolean;
            spells: SpellSource[];
            statistic?: {
                slug: string;
                tradition: MagicTradition;
            };
        };

        type AnimistVesselsData = {
            entry: SpellcastingEntryPF2e;
            primary: string[];
        };

        interface StaffSpellcasting extends SpellcastingEntry<CharacterPF2e> {
            staff: StaffPF2e;
        }
    }

    class PF2eDailiesModule extends Module {
        api: {
            canCastRank: (actor: CharacterPF2e, rank: ZeroToTen) => boolean | null;
            getStaffItem: (actor: CharacterPF2e) => PhysicalItemPF2e<CharacterPF2e> | null;
            setStaffChargesValue: (
                actor: CharacterPF2e,
                value?: number | undefined
            ) => Promise<foundry.abstract.Document> | undefined;
            openDailiesInterface: (actor: ActorPF2e) => Promise<void>;
            registerCustomDailies: (dailies: object[]) => void;
            getDailiesSummary: (actor: ActorPF2e) => string;
            canPrepareDailies: (actor: ActorPF2e) => boolean;
            getDisabledDailies: (actor: CharacterPF2e) => Record<string, boolean>;
            getAnimistConfigs: (actor: CharacterPF2e) => {
                lores: boolean;
                spells: boolean;
                signatures: boolean;
            };
            getAnimistVesselsData: (actor: CharacterPF2e) => dailies.AnimistVesselsData | undefined;
            utils: Record<string, Function>;
            dailyHelpers: {
                createComboSkillDaily: (
                    key: string,
                    uuid: string,
                    {
                        rank,
                        removeRules,
                    }?: {
                        rank?: OneToFour | undefined;
                        removeRules?: boolean | undefined;
                    }
                ) => object;
                createLoreSkillDaily: (key: string, uuid: string) => object;
                createLanguageDaily: (key: string, uuid: string) => object;
                createResistanceDaily: (
                    key: string,
                    uuid: string,
                    resistances: string[],
                    resistance: string | number | "half" | "level",
                    isRandom?: boolean
                ) => object;
                createScrollChainDaily: (key: string, uuids: [string, string, string]) => object;
            };
        };
    }
}
