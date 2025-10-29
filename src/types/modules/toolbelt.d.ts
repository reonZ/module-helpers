import {
    AbilityItemPF2e,
    ActorPF2e,
    CharacterPF2e,
    ChatMessagePF2e,
    CoinsPF2e,
    CreaturePF2e,
    DegreeAdjustmentsRecord,
    DegreeOfSuccessString,
    FeatPF2e,
    ItemPF2e,
    MacroPF2e,
    NPCPF2e,
    PhysicalItemPF2e,
    RollNoteSource,
    SaveType,
} from "foundry-pf2e";

declare global {
    namespace toolbelt {
        interface GamePF2e extends MyModule.GamePF2e<Api> {
            getToolSetting<K extends keyof Settings, S extends keyof Settings[K]>(
                tool: K,
                setting: S
            ): Settings[K][S];
        }

        interface Settings {
            actionable: {
                action: boolean;
                apply: boolean;
                item: boolean;
                spell: boolean;
                use: boolean;
            };
            betterTrade: {
                invertTrade: boolean;
                withContent: boolean;
            };
            heroActions: {
                enabled: boolean;
            };
            identify: {
                enabled: boolean;
                playerRequest: boolean;
            };
        }

        interface Api {
            actionable: {
                getActionMacro: (action: AbilityItemPF2e | FeatPF2e) => Promise<Maybe<MacroPF2e>>;
                getItemMacro: (item: ItemPF2e) => Promise<Maybe<MacroPF2e>>;
            };
            betterMerchant: {
                testItemsForMerchant: (
                    merchant: ActorPF2e,
                    items: ItemPF2e[]
                ) => betterMerchant.TestItemData[];
            };
            heroActions: {
                canTrade: () => boolean;
                discardHeroActions: (actor: CharacterPF2e, uuids: string[] | string) => void;
                drawHeroActions: (actor: CharacterPF2e) => Promise<void>;
                getDeckTable: () => Promise<RollTable | undefined>;
                getHeroActionDetails: (
                    uuid: string
                ) => Promise<heroActions.HeroActionDetails | undefined>;
                getHeroActions: (actor: CharacterPF2e) => heroActions.HeroAction[];
                getHeroActionsTemplateData: (
                    actor: CharacterPF2e
                ) => heroActions.HeroActionsTemplateData | undefined;
                giveHeroActions: (actor: CharacterPF2e) => Promise<void>;
                removeHeroActions: () => Promise<void>;
                sendActionToChat: (actor: CharacterPF2e, uuid: string) => Promise<void>;
                tradeHeroAction: (actor: CharacterPF2e) => Promise<void>;
                useHeroAction: (actor: CharacterPF2e, uuid: string) => Promise<void>;
                usesCountVariant: () => boolean;
            };
            identify: {
                openTracker: (item?: ItemPF2e) => void;
                requestIdentify: (item: Maybe<ItemPF2e>, skipNotify?: boolean) => void;
            };
            shareData: {
                getMasterInMemory: (actor: CreaturePF2e) => CreaturePF2e | undefined;
                getSlavesInMemory(actor: CreaturePF2e, idOnly: false): CreaturePF2e[];
                getSlavesInMemory(actor: CreaturePF2e, idOnly?: true): Set<ActorUUID> | undefined;
            };
            targetHelper: {
                getMessageTargets: (message: ChatMessagePF2e) => string[];
                setMessageFlagTargets: (
                    updates: Record<string, any>,
                    targets: string[]
                ) => Record<string, any>;
            };
        }

        namespace betterMerchant {
            type TestItemData = {
                buyPrice: CoinsPF2e;
                item: PhysicalItemPF2e<CharacterPF2e | NPCPF2e>;
            };
        }

        namespace heroActions {
            type HeroAction = {
                uuid: DocumentUUID;
                name: string;
            };

            type HeroActionDetails = {
                name: string;
                description: string;
            };

            type HeroActionsTemplateData<T extends HeroAction[] = HeroAction[]> = {
                actions: T;
                usesCount: boolean;
                mustDiscard: boolean;
                mustDraw: boolean;
                canUse: boolean;
                canTrade: boolean | 0;
                diff: number;
            };
        }

        namespace targetHelper {
            type TargetMessageType = "area" | "damage" | "spell" | "action" | "check";

            type MessageTargetSave = {
                die: number;
                dosAdjustments: DegreeAdjustmentsRecord | undefined;
                modifiers: { label: string; modifier: number }[];
                notes: RollNoteSource[];
                private: boolean;
                rerolled?: "hero" | "mythic" | "new" | "lower" | "higher";
                roll: string;
                significantModifiers: modifiersMatter.SignificantModifier[] | undefined;
                statistic: SaveType;
                success: DegreeOfSuccessString;
                unadjustedOutcome?: DegreeOfSuccessString | null;
                value: number;
            };

            type MessageTargetApplied = Record<`${number}` | number, boolean>;

            type MessageFlag = {
                author?: ActorUUID;
                applied?: Record<string, MessageTargetApplied>;
                isRegen?: boolean;
                item?: ItemUUID;
                options?: string[];
                private?: boolean;
                saveVariants?: Record<string, MessageSaveFlag>;
                splashIndex?: number;
                splashTargets?: string[];
                targets?: TokenDocumentUUID[];
                traits?: string[];
                type?: TargetMessageType;
            };

            type MessageSaveFlag = {
                basic: boolean;
                dc: number;
                saves?: Record<string, MessageTargetSave>;
                statistic: SaveType;
            };
        }
    }
}
