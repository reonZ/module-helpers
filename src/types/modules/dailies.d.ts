import {
    ActorPF2e,
    CharacterPF2e,
    EquipmentPF2e,
    MagicTradition,
    OneToFour,
    PhysicalItemPF2e,
    SpellcastingEntry,
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
            canPrepareDailies: (actor: ActorPF2e) => boolean;
            getDailiesSummary: (actor: ActorPF2e) => string;
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
