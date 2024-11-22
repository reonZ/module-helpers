import { ItemPF2e } from "foundry-pf2e";
declare function rollDamageFromFormula(formula: string, { actionName, item, origin, target }?: RollDamageExtraOptions): Promise<ChatMessage>;
type RollDamageExtraOptions = {
    item?: ItemPF2e;
    actionName?: string;
    origin?: TargetDocuments;
    target?: TargetDocuments;
};
export { rollDamageFromFormula };
export type { RollDamageExtraOptions };
