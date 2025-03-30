import { ActorPF2e, SpellSource, ZeroToTen } from "foundry-pf2e";
declare function hasSpells(actor: ActorPF2e): boolean;
declare function getRankLabel(rank: ZeroToTen): string;
declare function getSpellsFromDescriptionList(ul: HTMLElement, maxCharges?: number): Promise<SpellSource[]>;
export { getRankLabel, getSpellsFromDescriptionList, hasSpells };
