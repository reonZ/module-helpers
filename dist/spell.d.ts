import { ActorPF2e, ZeroToTen } from "foundry-pf2e";
declare function hasSpells(actor: ActorPF2e): boolean;
declare function getRankLabel(rank: ZeroToTen): string;
declare function getSpellsDataFromDescriptionList(ul: HTMLElement, maxCharges?: number): {
    rank: ZeroToTen;
    uuid: string;
}[];
export { getRankLabel, getSpellsDataFromDescriptionList, hasSpells };
