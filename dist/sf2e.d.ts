import { CharacterPF2e, Statistic, WeaponPF2e } from "foundry-pf2e";
declare const EXTRA_AREA_OPTIONS: string[];
/**
 * https://github.com/TikaelSol/sf2e-anachronism/blob/28ab37351cd4deb1f68f56ac6b6e42b7a3c373c5/module/actions/area-fire.mjs#L7C16-L7C37
 */
declare function createAreaFireMessage(weapon: WeaponPF2e<CharacterPF2e>): Promise<void>;
/**
 * https://github.com/TikaelSol/sf2e-anachronism/blob/28ab37351cd4deb1f68f56ac6b6e42b7a3c373c5/module/actions/area-fire.mjs#L146C1-L152C2
 */
declare function calculateSaveDC(weapon: WeaponPF2e<CharacterPF2e>): Statistic<CharacterPF2e>;
declare function getExtraAuxiliaryAction(item: WeaponPF2e): {
    label: string;
    glyph: string;
} | undefined;
export { calculateSaveDC, createAreaFireMessage, EXTRA_AREA_OPTIONS, getExtraAuxiliaryAction };
