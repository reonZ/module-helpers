import {
    AbilityItemPF2e,
    DegreeAdjustmentsRecord,
    DegreeOfSuccessString,
    EffectPF2e,
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
        }

        namespace targetHelper {
            type TargetMessageType = "damage" | "spell-damage" | "spell-save" | "action" | "check";

            type MessageTargetSave = {
                private: boolean;
                value: number;
                die: number;
                success: DegreeOfSuccessString;
                roll: string;
                notes: RollNoteSource[];
                dosAdjustments: DegreeAdjustmentsRecord | undefined;
                unadjustedOutcome?: DegreeOfSuccessString | null;
                modifiers: { label: string; modifier: number }[];
                significantModifiers: modifiersMatter.SignificantModifier[] | undefined;
                rerolled?: "hero" | "new" | "lower" | "higher";
                statistic: SaveType;
            };

            type MessageFlag = {
                type?: TargetMessageType;
                targets?: string[];
                save?: MessageSaveFlag;
                saves?: Record<string, MessageTargetSave>;
                splashIndex?: number;
                isRegen?: boolean;
                applied?: Record<string, boolean[]>;
                options?: string[];
                traits?: string[];
                item?: ItemUUID;
                splashTargets?: string[];
            };

            type MessageSaveFlag = {
                statistic: SaveType;
                basic: boolean;
                dc: number;
                author?: string;
            };
        }
    }
}
