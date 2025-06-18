import { CreaturePF2e, DCOptions, Rarity } from "foundry-pf2e";
/**
 * https://github.com/foundryvtt/pf2e/blob/49dc6d70c7e7bb26d8039c97361e638bdef6a3bd/src/module/dc.ts#L98
 */
declare function adjustDCByRarity(dc: number, rarity?: Rarity): number;
/**
 * https://github.com/foundryvtt/pf2e/blob/49dc6d70c7e7bb26d8039c97361e638bdef6a3bd/src/module/dc.ts#L108
 */
declare function calculateDC(level: number, { pwol, rarity }?: DCOptions): number;
declare function calculateCreatureDC(actor: CreaturePF2e, pwol?: boolean): number;
export { adjustDCByRarity, calculateCreatureDC, calculateDC };
