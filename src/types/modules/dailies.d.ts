import {
    ActorPF2e,
    CharacterPF2e,
    ChatMessagePF2e,
    EquipmentPF2e,
    ItemPF2e,
    MagicTradition,
    OneToFour,
    PhysicalItemPF2e,
    SpellcastingEntry,
    SpellcastingEntryPF2e,
    SpellSource,
    WeaponPF2e,
    ZeroToTen,
} from "foundry-pf2e";

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
            entry: SpellcastingEntryPF2e<CharacterPF2e>;
            primary: string[];
        };

        interface StaffSpellcasting extends SpellcastingEntry<CharacterPF2e> {
            staff: StaffPF2e;
        }

        interface Api {
            canCastRank: (actor: CharacterPF2e, rank: ZeroToTen) => boolean | null;
            canPrepareDailies: (actor: ActorPF2e) => boolean;
            createRetrainBtn: (
                actor: ActorPF2e,
                selectedId: string,
                type: "vessel" | "tactic"
            ) => HTMLElement;
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
                createLanguageDaily: (key: string, uuid: string) => object;
                createLoreSkillDaily: (key: string, uuid: string) => object;
                createResistanceDaily: (
                    key: string,
                    uuid: string,
                    resistances: string[],
                    resistance: string | number | "half" | "level",
                    isRandom?: boolean
                ) => object;
                createScrollChainDaily: (key: string, uuids: [string, string, string]) => object;
            };
            getAnimistConfigs: (actor: CharacterPF2e) => {
                lores: boolean;
                spells: boolean;
                signatures: boolean;
            };
            getAnimistVesselsData: (
                actor: Maybe<ActorPF2e>
            ) => dailies.AnimistVesselsData | undefined;
            getCommanderTactics: (actor: ActorPF2e) => string[];
            getDailiesSummary: (actor: ActorPF2e) => string;
            getDisabledDailies: (actor: CharacterPF2e) => Record<string, boolean>;
            getStaffItem: (actor: CharacterPF2e) => PhysicalItemPF2e<CharacterPF2e> | null;
            isTacticAbility: (item: Maybe<ItemPF2e>) => item is ItemPF2e;
            openDailiesInterface: (actor: ActorPF2e) => Promise<void>;
            retrain: (
                actor: ActorPF2e,
                selectedId: string,
                type: "vessel" | "tactic"
            ) => Promise<ChatMessagePF2e | undefined>;
            retrainFromElement: (
                actor: ActorPF2e,
                target: HTMLElement
            ) => Promise<ChatMessagePF2e | undefined>;
            registerCustomDailies: (dailies: object[]) => void;
            setStaffChargesValue: (
                actor: CharacterPF2e,
                value?: number | undefined
            ) => Promise<foundry.abstract.Document> | undefined;
            utils: Record<string, Function>;
        }
    }
}
