import { ItemPF2e } from "foundry-pf2e";
declare function rollDamageFromFormula(formula: string, { actionName, item, origin, target, extraRollOptions, skipDialog, toolbelt, }?: RollDamageExtraOptions): Promise<ChatMessage>;
type RollDamageExtraOptions = {
    item?: ItemPF2e;
    actionName?: string;
    origin?: TargetDocuments;
    target?: TargetDocuments;
    extraRollOptions?: string[];
    skipDialog?: boolean;
    toolbelt?: Pick<toolbelt.targetHelper.MessageFlag, "save" | "options" | "traits">;
};
export { rollDamageFromFormula };
export type { RollDamageExtraOptions };
