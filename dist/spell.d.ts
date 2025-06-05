import { CreaturePF2e, OneToTen } from "foundry-pf2e";
declare const MAGIC_TRADITIONS: Set<"arcane" | "divine" | "occult" | "primal">;
/**
 * https://github.com/foundryvtt/pf2e/blob/5ebcd0359d1358bb00b76c47e7b84289239234b9/src/module/item/spellcasting-entry/helpers.ts#L43
 */
declare function getSpellRankLabel(group: "cantrips" | number): string;
declare function getActorMaxRank(actor: CreaturePF2e): OneToTen;
export { getActorMaxRank, getSpellRankLabel, MAGIC_TRADITIONS };
