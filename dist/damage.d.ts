import { ItemPF2e } from "foundry-pf2e";
declare function rollDamageFromFormula(formula: string, { actionName, extraRollOptions, item, origin, skipDialog, target, toolbelt, }: RollDamageOptions): Promise<ChatMessage>;
type RollDamageOptions = {
    actionName?: string;
    extraRollOptions?: string[];
    item?: ItemPF2e;
    origin?: TargetDocuments;
    skipDialog?: boolean;
    target?: TargetDocuments;
    toolbelt?: RollDamageToolbeltFlag;
};
type RollDamageToolbeltFlag = Pick<toolbelt.targetHelper.MessageFlag, "saveVariants" | "options" | "traits" | "item">;
export { rollDamageFromFormula };
export type { RollDamageOptions };
