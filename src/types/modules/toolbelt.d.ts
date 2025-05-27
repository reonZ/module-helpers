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
            targetHelper: {
                getMessageTargets: (message: ChatMessagePF2e) => string[];
                setMessageFlagTargets: <T extends Record<string, any>>(
                    updates: T,
                    targets: string[]
                ) => T;
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
                applied?: Record<string, MessageTargetApplied>;
                isRegen?: boolean;
                item?: ItemUUID;
                options?: string[];
                save?: MessageSaveFlag;
                saves?: Record<string, MessageTargetSave>;
                splashIndex?: number;
                splashTargets?: string[];
                targets?: TokenDocumentUUID[];
                traits?: string[];
                type?: TargetMessageType;
            };

            type MessageSaveFlag = {
                author?: ActorUUID;
                basic: boolean;
                dc: number;
                statistic: SaveType;
            };
        }
    }
}
