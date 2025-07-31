import {
    AbilityItemPF2e,
    ChatMessagePF2e,
    DegreeAdjustmentsRecord,
    DegreeOfSuccessString,
    FeatPF2e,
    ItemPF2e,
    MacroPF2e,
    RollNoteSource,
    SaveType,
} from "foundry-pf2e";

declare global {
    namespace toolbelt {
        interface GamePF2e extends MyModule.GamePF2e<ToolbeltApi> {
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
                withContent: boolean;
            };
        }

        interface ToolbeltApi {
            actionable: {
                getActionMacro: (action: AbilityItemPF2e | FeatPF2e) => Promise<Maybe<MacroPF2e>>;
                getItemMacro: (item: ItemPF2e) => Promise<Maybe<MacroPF2e>>;
            };
            identify: {
                openTracker: (item?: ItemPF2e) => void;
            };
            targetHelper: {
                getMessageTargets: (message: ChatMessagePF2e) => string[];
                setMessageFlagTargets: (
                    updates: Record<string, any>,
                    targets: string[]
                ) => Record<string, any>;
            };
        }

        namespace targetHelper {
            type TargetMessageType = "damage" | "spell" | "action" | "check";

            type MessageTargetSave = {
                die: number;
                dosAdjustments: DegreeAdjustmentsRecord | undefined;
                modifiers: { label: string; modifier: number }[];
                notes: RollNoteSource[];
                private: boolean;
                rerolled?: "hero" | "new" | "lower" | "higher";
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
                saveVariants?: Record<string, Record<string, MessageSaveFlag>>;
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
