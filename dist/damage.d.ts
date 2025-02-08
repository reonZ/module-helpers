import { ItemPF2e } from "foundry-pf2e";
declare function rollDamageFromFormula(formula: string, { actionName, item, origin, target, extraRollOptions, skipDialog, }?: RollDamageExtraOptions): Promise<ChatMessage>;
type RollDamageExtraOptions = {
    item?: ItemPF2e;
    actionName?: string;
    origin?: TargetDocuments;
    target?: TargetDocuments;
    extraRollOptions?: string[];
    skipDialog?: boolean;
};
export { rollDamageFromFormula };
export type { RollDamageExtraOptions };
