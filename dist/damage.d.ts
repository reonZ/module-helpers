import { ItemPF2e, RollNotePF2e, RollNoteSource } from "foundry-pf2e";
declare function rollDamageFromFormula(formula: string, { actionName, extraRollOptions, item, notes, origin, skipDialog, target, toolbelt, }: RollDamageOptions): Promise<ChatMessage>;
type RollDamageOptions = {
    actionName?: string;
    extraRollOptions?: string[];
    item?: ItemPF2e;
    notes?: (RollNoteSource | RollNotePF2e)[];
    origin?: TargetDocuments;
    skipDialog?: boolean;
    target?: TargetDocuments;
    toolbelt?: RollDamageToolbeltFlag;
};
type RollDamageToolbeltFlag = Pick<toolbelt.targetHelper.MessageFlag, "author" | "saveVariants" | "options" | "private" | "traits" | "item" | "targets">;
export { rollDamageFromFormula };
export type { RollDamageOptions };
