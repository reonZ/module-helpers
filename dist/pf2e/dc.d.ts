import { CreaturePF2e, Rarity } from "foundry-pf2e";
declare function adjustDCByRarity(dc: number, rarity?: Rarity): number;
declare function calculateDC(level: number, { pwol, rarity }?: DCOptions): number;
declare function calculateCreatureDC(actor: CreaturePF2e, pwol?: boolean): number;
interface DCOptions {
    pwol?: boolean;
    rarity?: Rarity;
}
export { adjustDCByRarity, calculateCreatureDC, calculateDC };
export type { DCOptions };
