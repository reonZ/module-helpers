import { ItemPF2e, RollNotePF2e, RollNoteSource, TokenDocumentPF2e } from "foundry-pf2e";
declare function rollDamageFromFormula(formula: string, { actionName, extraRollOptions, item, notes, origin, skipDialog, target, toolbelt, }: RollDamageOptions): Promise<ChatMessage>;
declare function getTargetToken(target: Maybe<TargetDocuments>): TokenDocumentPF2e | undefined;
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
export { getTargetToken, rollDamageFromFormula };
export type { RollDamageOptions };
